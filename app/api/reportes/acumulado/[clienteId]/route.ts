import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TipoImpuesto } from '@prisma/client';

export async function GET(
    request: Request,
    { params }: { params: { clienteId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const periodo = searchParams.get('periodo'); // Formato esperado: MM/YYYY

        if (!periodo) {
            return NextResponse.json(
                { error: 'El parámetro periodo (MM/YYYY) es requerido' },
                { status: 400 }
            );
        }

        const clienteId = parseInt(params.clienteId);
        if (isNaN(clienteId)) {
            return NextResponse.json(
                { error: 'ID de cliente inválido' },
                { status: 400 }
            );
        }

        // Parsear periodo (MM/YYYY)
        const [mesStr, anioStr] = periodo.split('/');
        const mes = parseInt(mesStr);
        const anio = parseInt(anioStr);

        if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) {
            return NextResponse.json(
                { error: 'Formato de periodo inválido. Use MM/YYYY' },
                { status: 400 }
            );
        }

        // Calcular fechas de inicio y fin del mes
        // Nota: En JS los meses van de 0 a 11
        const startOfMonth = new Date(anio, mes - 1, 1);
        const endOfMonth = new Date(anio, mes, 0, 23, 59, 59, 999);

        // Realizar cálculos agregados usando Prisma
        // Filtramos por clienteId y rango de fechas en el Comprobante asociado
        const acumulados = await prisma.imputacionContable.groupBy({
            by: ['impuestoTipo'],
            where: {
                comprobante: {
                    clienteId: clienteId,
                    fecha: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            },
            _sum: {
                montoImputable: true,
            },
        });

        // Procesar resultados
        let totalIvaDeducible = 0;
        let totalIrpBase = 0;

        acumulados.forEach((item) => {
            const monto = Number(item._sum.montoImputable) || 0;
            if (item.impuestoTipo === TipoImpuesto.IVA) {
                totalIvaDeducible += monto;
            } else if (item.impuestoTipo === TipoImpuesto.IRP) {
                totalIrpBase += monto;
            }
        });

        return NextResponse.json({
            clienteId,
            periodo,
            totalIvaDeducible,
            totalIrpBase,
        });

    } catch (error) {
        console.error('Error calculando acumulados:', error);
        return NextResponse.json(
            { error: 'Error al calcular acumulados' },
            { status: 500 }
        );
    }
}
