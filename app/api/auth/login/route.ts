import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (!usuario) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, usuario.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const token = generateToken({
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol,
        });

        return NextResponse.json({
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Error al iniciar sesión' },
            { status: 500 }
        );
    }
}
