import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// GET - Listar todos los usuarios
export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true,
                // No incluimos password por seguridad
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(usuarios);
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        return NextResponse.json(
            { error: 'Error al obtener usuarios' },
            { status: 500 }
        );
    }
}

// POST - Crear nuevo usuario (Contador)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, nombre, rol, password } = body;

        // Validaciones básicas
        if (!email || !nombre || !rol || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Verificar que el rol sea válido
        if (rol !== 'ADMIN' && rol !== 'CONTADOR') {
            return NextResponse.json(
                { error: 'Rol inválido. Debe ser ADMIN o CONTADOR' },
                { status: 400 }
            );
        }

        // Verificar que el email no exista
        const existingUser = await prisma.usuario.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'El email ya está registrado' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Crear usuario
        const usuario = await prisma.usuario.create({
            data: {
                email,
                nombre,
                rol,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(usuario, { status: 201 });
    } catch (error) {
        console.error('Error creating usuario:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: 'Error al crear usuario', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
