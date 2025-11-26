'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth.client';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const session = getSession();
        if (!session) {
            router.push('/login');
            return;
        }

        if (session.rol === 'ADMIN') {
            router.push('/dashboard/usuarios');
        } else {
            router.push('/dashboard/clientes');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-slate-500">Redirigiendo...</div>
        </div>
    );
}
