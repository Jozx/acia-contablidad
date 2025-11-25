import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TipoRegistro, OrigenComprobante, TipoImpuesto } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { comprobanteData, imputacionesData } = body;

        // 1. Validaciones básicas de entrada
        if (!comprobanteData || !imputacionesData || !Array.isArray(imputacionesData)) {
            return NextResponse.json(
                { error: 'Datos inválidos. Se requiere comprobanteData y un array de imputacionesData' },
                { status: 400 }
            );
        }

        // Validar campos requeridos del comprobante
        const requiredFields = [
            'timbrado', 'numeroComprobante', 'fecha', 'tipoRegistro',
            'origenComprobante', 'rucEmisor', 'razonSocialEmisor',
            'rucReceptor', 'razonSocialReceptor', 'montoTotal',
            'clienteId'
        ];

        for (const field of requiredFields) {
            if (!comprobanteData[field]) {
                return NextResponse.json(
                    { error: `El campo ${field} es requerido en comprobanteData` },
                    { status: 400 }
                );
            }
        }

        // Validar que si hay montos gravados, existan imputaciones
        // Si es solo exentas (IVA 10 y 5 son 0), no es obligatorio tener imputaciones
        const hasGravado = (Number(comprobanteData.montoGravado10) > 0) || (Number(comprobanteData.montoGravado5) > 0);

        if (hasGravado && imputacionesData.length === 0) {
            return NextResponse.json(
                { error: 'El comprobante tiene montos gravados pero no se han especificado imputaciones' },
                { status: 400 }
            );
        }

        // 2. Transacción de Prisma
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await prisma.$transaction(async (tx: any) => {
            // Crear el Comprobante
            const comprobante = await tx.comprobante.create({
                data: {
                    timbrado: comprobanteData.timbrado,
                    numeroComprobante: comprobanteData.numeroComprobante,
                    fecha: new Date(comprobanteData.fecha),
                    tipoRegistro: comprobanteData.tipoRegistro as TipoRegistro,
                    origenComprobante: comprobanteData.origenComprobante as OrigenComprobante,
                    rucEmisor: comprobanteData.rucEmisor,
                    razonSocialEmisor: comprobanteData.razonSocialEmisor,
                    rucReceptor: comprobanteData.rucReceptor,
                    razonSocialReceptor: comprobanteData.razonSocialReceptor,
                    montoTotal: comprobanteData.montoTotal,
                    montoGravado10: comprobanteData.montoGravado10 || 0,
                    montoGravado5: comprobanteData.montoGravado5 || 0,
                    montoExento: comprobanteData.montoExento || 0,
                    montoIVA10: comprobanteData.montoIVA10 || 0,
                    montoIVA5: comprobanteData.montoIVA5 || 0,
                    clienteId: comprobanteData.clienteId,
                },
            });

            // Preparar datos para createMany de Imputaciones
            if (imputacionesData.length > 0) {
                const imputacionesToCreate = imputacionesData.map((imp: { impuestoTipo: string; montoImputable: number; periodo: string }) => ({
                    comprobanteId: comprobante.id,
                    impuestoTipo: imp.impuestoTipo as TipoImpuesto,
                    montoImputable: imp.montoImputable,
                    periodo: imp.periodo, // Asegurarse de enviar el periodo (YYYY-MM)
                }));

                // Crear las Imputaciones
                await tx.imputacionContable.createMany({
                    data: imputacionesToCreate,
                });
            }

            // Retornar el comprobante con sus imputaciones para la respuesta
            return await tx.comprobante.findUnique({
                where: { id: comprobante.id },
                include: { imputaciones: true },
            });
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        console.error('Error creando comprobante:', error);
        return NextResponse.json(
            { error: 'Error al procesar la transacción del comprobante', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
