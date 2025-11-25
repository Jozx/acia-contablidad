'use client';

import Link from 'next/link';
import { Usuario } from '@prisma/client';
import { useState } from 'react';

interface UsuariosTableProps {
    usuarios: Usuario[];
}

export default function UsuariosTable({ usuarios }: UsuariosTableProps) {
    const [loading, setLoading] = useState<number | null>(null);

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        setLoading(id);
        try {
            const response = await fetch(`/api/usuarios/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activo: !currentStatus }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al actualizar el usuario');
            }
        } catch (error) {
            alert('Error al actualizar el usuario');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            return;
        }

        setLoading(id);
        try {
            const response = await fetch(`/api/usuarios/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al eliminar el usuario');
            }
        } catch (error) {
            alert('Error al eliminar el usuario');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            {usuario.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {usuario.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {usuario.rol}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <Link
                                                href={`/dashboard/usuarios/${usuario.id}/editar`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleToggleActive(usuario.id, usuario.activo)}
                                                disabled={loading === usuario.id}
                                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                                            >
                                                {usuario.activo ? 'Deshabilitar' : 'Habilitar'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(usuario.id)}
                                                disabled={loading === usuario.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
