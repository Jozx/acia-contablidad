import Link from 'next/link';

export default function DashboardHeader() {
    return (
        <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                    Clientes
                </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link
                    href="/dashboard/clientes/nuevo"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    + Nuevo Cliente
                </Link>
            </div>
        </div>
    );
}
