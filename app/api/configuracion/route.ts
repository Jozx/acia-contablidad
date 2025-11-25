import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const configuracion = await prisma.configuracion.findUnique({
            where: { id: 1 },
        });

        if (!configuracion) {
            return NextResponse.json({}, { status: 200 });
        }

        return NextResponse.json(configuracion);
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        return NextResponse.json(
            { error: 'Error al obtener configuración' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { telefono, emailContacto, urlLinkedIn, direccion } = body;

        // Usar upsert para crear o actualizar el único registro
        const configuracion = await prisma.configuracion.upsert({
            where: { id: 1 },
            update: {
                telefono,
                emailContacto,
                urlLinkedIn,
                direccion,
            },
            create: {
                id: 1,
                telefono,
                emailContacto,
                urlLinkedIn,
                direccion,
            },
        });

        return NextResponse.json(configuracion, { status: 200 });
    } catch (error) {
        console.error('Error actualizando configuración:', error);
        return NextResponse.json(
            { error: 'Error al actualizar configuración' },
            { status: 500 }
        );
    }
}
