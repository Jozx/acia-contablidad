import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Función utilitaria para extraer los dígitos del RUC
 * Ejemplo: "80001234-5" -> { digitoVencimiento: 4, digitoVerificador: 5 }
 * @param ruc - RUC en formato paraguayo
 * @returns Objeto con digitoVencimiento y digitoVerificador
 */
function extractDigitosRUC(ruc: string): { digitoVencimiento: number; digitoVerificador: number } {
    // Remover puntos y espacios
    const rucLimpio = ruc.replace(/[.\s]/g, '');

    // Dividir por el guion
    const partes = rucLimpio.split('-');
    if (partes.length < 2) {
        throw new Error('Formato de RUC inválido. Debe incluir guion (-)');
    }

    // Obtener el último dígito de la primera parte (número del RUC)
    const numeroBase = partes[0];
    const digitoVencimiento = parseInt(numeroBase.charAt(numeroBase.length - 1));

    // Obtener el dígito verificador (después del guion)
    const digitoVerificador = parseInt(partes[1]);

    if (isNaN(digitoVencimiento) || isNaN(digitoVerificador)) {
        throw new Error('No se pudieron extraer los dígitos del RUC');
    }

    return { digitoVencimiento, digitoVerificador };
}

// GET - Listar todos los clientes con su contador asignado
export async function GET() {
    try {
        const clientes = await prisma.cliente.findMany({
            include: {
                contador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        rol: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(clientes);
    } catch (error) {
        console.error('Error fetching clientes:', error);
        return NextResponse.json(
            { error: 'Error al obtener clientes' },
            { status: 500 }
        );
    }
}

// POST - Crear nuevo cliente
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ruc, razonSocial, actividadEconomica, impuestos, contadorId } = body;

        // Validaciones básicas
        if (!ruc || !razonSocial || !contadorId) {
            return NextResponse.json(
                { error: 'RUC, razón social y contador son requeridos' },
                { status: 400 }
            );
        }

        // Verificar que el RUC no exista
        const existingCliente = await prisma.cliente.findUnique({
            where: { ruc },
        });

        if (existingCliente) {
            return NextResponse.json(
                { error: 'El RUC ya está registrado' },
                { status: 400 }
            );
        }

        // Verificar que el contador exista
        const contador = await prisma.usuario.findUnique({
            where: { id: contadorId },
        });

        if (!contador) {
            return NextResponse.json(
                { error: 'El contador especificado no existe' },
                { status: 400 }
            );
        }

        // Extraer dígitos del RUC
        let digitoVencimiento: number;
        let digitoVerificador: number;
        try {
            const digitos = extractDigitosRUC(ruc);
            digitoVencimiento = digitos.digitoVencimiento;
            digitoVerificador = digitos.digitoVerificador;
        } catch (error) {
            return NextResponse.json(
                { error: error instanceof Error ? error.message : 'Error al procesar el RUC' },
                { status: 400 }
            );
        }

        // Crear cliente
        const cliente = await prisma.cliente.create({
            data: {
                ruc,
                razonSocial,
                actividadEconomica: actividadEconomica || null,
                impuestos: impuestos || [],
                digitoVencimiento,
                digitoVerificador,
                contadorId,
            },
            include: {
                contador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        rol: true,
                    },
                },
            },
        });

        return NextResponse.json(cliente, { status: 201 });
    } catch (error) {
        console.error('Error creating cliente:', error);
        return NextResponse.json(
            { error: 'Error al crear cliente' },
            { status: 500 }
        );
    }
}
