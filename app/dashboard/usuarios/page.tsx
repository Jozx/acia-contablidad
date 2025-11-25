import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import UsuariosTable from '@/components/dashboard/UsuariosTable';

export const dynamic = 'force-dynamic';

async function fetchUsuarios() {
    try {
        const usuarios = await prisma.usuario.findMany({
            where: {
                deletedAt: null, // Only show non-deleted users
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return usuarios;
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        return [];
    }
}

export default async function UsuariosPage() {
    const usuarios = await fetchUsuarios();

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                            Usuarios
                        </h2>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <Link
                            href="/dashboard/usuarios/nuevo"
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            + Nuevo Usuario
                        </Link>
                    </div>
                </div>

                <div className="py-4">
                    <UsuariosTable usuarios={usuarios} />
                </div>
            </div>
        </div>
    );
}
