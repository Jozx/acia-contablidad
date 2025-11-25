import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth.client';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ClienteTable from '@/components/dashboard/ClienteTable';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function fetchClientes(userRole: string, userId: number) {
    try {
        // ADMIN has no access to clients
        if (userRole === 'ADMIN') {
            return [];
        }

        // CONTADOR_GENERAL sees all clients
        if (userRole === 'CONTADOR_GENERAL') {
            const clientes = await prisma.cliente.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return clientes;
        }

        // CONTADOR sees only their own clients
        if (userRole === 'CONTADOR') {
            const clientes = await prisma.cliente.findMany({
                where: {
                    contadorId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return clientes;
        }

        return [];
    } catch (error) {
        console.error('Error fetching clientes:', error);
        return [];
    }
}

export default async function ClientesPage() {
    // Note: In a real app, we'd get session from server-side cookies
    // For this MVP, we're simulating with a placeholder
    // You'll need to implement proper server-side session handling

    // Temporary: Fetch all clients for now
    // TODO: Implement proper role-based filtering with server-side session
    const clientes = await prisma.cliente.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <DashboardHeader />
                <div className="py-4">
                    <ClienteTable clientes={clientes} />
                </div>
            </div>
        </div>
    );
}
