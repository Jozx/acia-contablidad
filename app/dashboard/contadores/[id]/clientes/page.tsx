import { prisma } from '@/lib/prisma';
import ClienteTable from '@/components/dashboard/ClienteTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function fetchContadorWithClientes(id: number) {
    try {
        const contador = await prisma.usuario.findUnique({
            where: { id },
            include: {
                clientes: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });
        return contador;
    } catch (error) {
        console.error('Error fetching contador:', error);
        return null;
    }
}

export default async function ContadorClientesPage({
    params,
}: {
    params: { id: string };
}) {
    const contador = await fetchContadorWithClientes(parseInt(params.id));

    if (!contador) {
        return (
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <p className="text-red-600">Contador no encontrado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="mb-4">
                    <Link
                        href="/dashboard/contadores"
                        className="text-blue-600 hover:text-blue-900"
                    >
                        ← Volver a Contadores
                    </Link>
                </div>

                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                            Clientes de {contador.nombre}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">{contador.email}</p>
                    </div>
                </div>

                <div className="py-4">
                    <ClienteTable clientes={contador.clientes} />
                </div>
            </div>
        </div>
    );
}
