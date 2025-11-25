import Link from 'next/link';
import { Cliente, TipoImpuesto } from '@prisma/client';

interface ClienteTableProps {
    clientes: Cliente[];
}

export default function ClienteTable({ clientes }: ClienteTableProps) {
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                    >
                                        RUC
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                    >
                                        Razón Social
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                    >
                                        Actividad Económica
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                    >
                                        Impuestos
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {clientes.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                            {cliente.ruc}-{cliente.digitoVerificador}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {cliente.razonSocial}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {cliente.actividadEconomica || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            <div className="flex space-x-2">
                                                {cliente.impuestos.map((impuesto) => (
                                                    <span
                                                        key={impuesto}
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${impuesto === TipoImpuesto.IVA
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        {impuesto}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/dashboard/clientes/${cliente.id}`}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Ver Detalle
                                            </Link>
                                            <Link
                                                href={`/dashboard/clientes/${cliente.id}/editar`}
                                                className="text-slate-600 hover:text-slate-900"
                                            >
                                                Gestionar
                                            </Link>
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
