'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession, clearSession } from '@/lib/auth.client';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const session = getSession();
        if (!session) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            setUserName(session.nombre);
            setUserRole(session.rol);
        }
    }, [router]);

    const handleLogout = () => {
        clearSession();
        router.push('/login');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-white">Verificando autenticación...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Dashboard Navigation */}
            <nav className="bg-slate-900 border-b border-slate-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link
                                    href={userRole === 'ADMIN' ? '/dashboard/usuarios' : '/dashboard/clientes'}
                                    className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
                                >
                                    ACIA Dashboard
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {/* Show Clientes for CONTADOR and CONTADOR_GENERAL */}
                                {(userRole === 'CONTADOR' || userRole === 'CONTADOR_GENERAL') && (
                                    <Link
                                        href="/dashboard/clientes"
                                        className="border-transparent text-slate-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                                    >
                                        Clientes
                                    </Link>
                                )}

                                {/* Show Contadores only for CONTADOR_GENERAL */}
                                {userRole === 'CONTADOR_GENERAL' && (
                                    <Link
                                        href="/dashboard/contadores"
                                        className="border-transparent text-slate-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                                    >
                                        Contadores
                                    </Link>
                                )}

                                {/* Show Usuarios only for ADMIN */}
                                {userRole === 'ADMIN' && (
                                    <Link
                                        href="/dashboard/usuarios"
                                        className="border-transparent text-slate-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                                    >
                                        Usuarios
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-slate-300 text-sm">
                                {userName} <span className="text-slate-500">({userRole})</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-10">
                {children}
            </main>
        </div>
    );
}
