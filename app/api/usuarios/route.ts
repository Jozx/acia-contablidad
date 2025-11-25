import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateSecurePassword } from '@/lib/password';

// GET - Listar todos los usuarios (excluir eliminados)
export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                activo: true,
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

// POST - Crear nuevo usuario con contraseña temporal
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, nombre, rol } = body;

        // Validaciones básicas
        if (!email || !nombre || !rol) {
            return NextResponse.json(
                { error: 'Email, nombre y rol son requeridos' },
                { status: 400 }
            );
        }

        // Verificar que el rol sea válido
        if (rol !== 'ADMIN' && rol !== 'CONTADOR' && rol !== 'CONTADOR_GENERAL') {
            return NextResponse.json(
                { error: 'Rol inválido' },
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

        // Generar contraseña temporal segura
        const temporaryPassword = generateSecurePassword();
        const hashedPassword = await hashPassword(temporaryPassword);

        // Crear usuario
        const usuario = await prisma.usuario.create({
            data: {
                email,
                nombre,
                rol,
                password: hashedPassword,
                activo: true,
            },
            select: {
                id: true,
                email: true,
                nombre: true,
                rol: true,
                activo: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Devolver usuario y contraseña temporal (solo esta vez)
        return NextResponse.json(
            { ...usuario, temporaryPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating usuario:', error);
        return NextResponse.json(
            { error: 'Error al crear usuario' },
            { status: 500 }
        );
    }
}
