'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/auth.client';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Simulate login by fetching users and finding a match
            const response = await fetch('/api/usuarios');

            if (!response.ok) {
                throw new Error('Error al conectar con el servidor');
            }

            const usuarios = await response.json();

            // Find user by email (in a real app, this would be done server-side)
            const user = usuarios.find((u: any) => u.email === email);

            if (!user) {
                setError('Credenciales inválidas');
                setLoading(false);
                return;
            }

            // Save session (in MVP, we're not validating password)
            saveSession({
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol,
            });

            // Redirect based on user role
            if (user.rol === 'ADMIN') {
                router.push('/dashboard/usuarios');
            } else {
                // CONTADOR and CONTADOR_GENERAL go to clientes
                router.push('/dashboard/clientes');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        ACIA Contabilidad
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        Acceso para contadores
                    </p>
                </div>
                <form className="mt-8 space-y-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 placeholder-slate-400 text-white bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-slate-600 placeholder-slate-400 text-white bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-900/50 border border-red-700 p-4">
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
