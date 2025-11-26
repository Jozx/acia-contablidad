'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NuevoUsuarioPage() {
    const router = useRouter();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('CONTADOR');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, rol }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al crear usuario');
            }

            const data = await response.json();
            setGeneratedPassword(data.temporaryPassword);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (generatedPassword) {
        return (
            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">
                                Usuario creado exitosamente
                            </h3>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-green-800 mb-2">
                                    El usuario <strong>{email}</strong> ha sido creado.
                                </p>
                                <p className="text-sm text-green-800">
                                    Contraseña temporal generada:
                                </p>
                                <div className="mt-2 bg-white border border-green-300 rounded px-4 py-3">
                                    <code className="text-lg font-mono text-slate-900">{generatedPassword}</code>
                                </div>
                                <p className="text-xs text-green-700 mt-2">
                                    ⚠️ Guarda esta contraseña. No se volverá a mostrar.
                                </p>
                            </div>

                            <div className="flex space-x-3">
                                <Link
                                    href="/dashboard/usuarios"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Volver a Usuarios
                                </Link>
                                <button
                                    onClick={() => {
                                        setGeneratedPassword('');
                                        setNombre('');
                                        setEmail('');
                                        setRol('CONTADOR');
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                                >
                                    Crear Otro Usuario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="mb-4">
                    <Link
                        href="/dashboard/usuarios"
                        className="text-blue-600 hover:text-blue-900"
                    >
                        ← Volver a Usuarios
                    </Link>
                </div>

                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-slate-900 mb-6">
                            Crear Nuevo Usuario
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
                                    Nombre y Apellido
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email (Usuario de login)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                    placeholder="juan@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="rol" className="block text-sm font-medium text-slate-700 mb-2">
                                    Rol
                                </label>
                                <select
                                    id="rol"
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                                >
                                    <option value="CONTADOR">Contador</option>
                                    <option value="CONTADOR_GENERAL">Contador General</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <Link
                                    href="/dashboard/usuarios"
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Creando...' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
