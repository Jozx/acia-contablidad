'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getSession } from '@/lib/auth.client';

export default function ClientForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('');
    const [formData, setFormData] = useState({
        ruc: '',
        razonSocial: '',
        actividadEconomica: '',
        impuestos: [] as string[],
        contadorAsignadoId: '1', // Default to 1, will be updated by session
    });

    useEffect(() => {
        const session = getSession();
        if (session) {
            setUserRole(session.rol);
            if (session.rol === 'CONTADOR') {
                setFormData(prev => ({
                    ...prev,
                    contadorAsignadoId: session.id.toString()
                }));
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const currentImpuestos = [...prev.impuestos];
            if (checked) {
                currentImpuestos.push(value);
            } else {
                const index = currentImpuestos.indexOf(value);
                if (index > -1) {
                    currentImpuestos.splice(index, 1);
                }
            }
            return {
                ...prev,
                impuestos: currentImpuestos,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    contadorId: parseInt(formData.contadorAsignadoId),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al crear el cliente');
            }

            router.push('/dashboard/clientes');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Información del Cliente</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Ingrese los datos fiscales y generales del nuevo cliente.
                    </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="ruc" className="block text-sm font-medium text-gray-700">
                                RUC <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ruc"
                                id="ruc"
                                required
                                value={formData.ruc}
                                onChange={handleChange}
                                placeholder="Ej: 80001234-5"
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-700">
                                Razón Social <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="razonSocial"
                                id="razonSocial"
                                required
                                value={formData.razonSocial}
                                onChange={handleChange}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900"
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="actividadEconomica" className="block text-sm font-medium text-gray-700">
                                Actividad Económica <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="actividadEconomica"
                                id="actividadEconomica"
                                required
                                value={formData.actividadEconomica}
                                onChange={handleChange}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-gray-900"
                            />
                        </div>

                        {userRole === 'CONTADOR_GENERAL' && (
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="contadorAsignadoId" className="block text-sm font-medium text-gray-700">
                                    Contador Asignado <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="contadorAsignadoId"
                                    name="contadorAsignadoId"
                                    required
                                    value={formData.contadorAsignadoId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                >
                                    <option value="1">Seleccione Contador (Default: 1)</option>
                                    {/* Future: Map through actual accountants */}
                                </select>
                            </div>
                        )}

                        <div className="col-span-6">
                            <span className="block text-sm font-medium text-gray-700">Impuestos</span>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="impuesto-iva"
                                            name="impuestos"
                                            value="IVA"
                                            type="checkbox"
                                            checked={formData.impuestos.includes('IVA')}
                                            onChange={handleCheckboxChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="impuesto-iva" className="font-medium text-gray-700">
                                            IVA (Impuesto al Valor Agregado)
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="impuesto-irp"
                                            name="impuestos"
                                            value="IRP"
                                            type="checkbox"
                                            checked={formData.impuestos.includes('IRP')}
                                            onChange={handleCheckboxChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="impuesto-irp" className="font-medium text-gray-700">
                                            IRP (Impuesto a la Renta Personal)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mt-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar Cliente'}
                </button>
            </div>
        </form>
    );
}
