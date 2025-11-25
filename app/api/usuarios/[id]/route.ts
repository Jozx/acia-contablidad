import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Actualizar usuario (editar o toggle activo)
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        const usuario = await prisma.usuario.update({
            where: { id },
            data: body,
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

        return NextResponse.json(usuario);
    } catch (error) {
        console.error('Error updating usuario:', error);
        return NextResponse.json(
            { error: 'Error al actualizar usuario' },
            { status: 500 }
        );
    }
}

// DELETE - Soft delete (marcar como eliminado)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        await prisma.usuario.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                activo: false,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting usuario:', error);
        return NextResponse.json(
            { error: 'Error al eliminar usuario' },
            { status: 500 }
        );
    }
}
