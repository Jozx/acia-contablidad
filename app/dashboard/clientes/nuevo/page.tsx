import ClientForm from '@/components/dashboard/client/ClientForm';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function NewClientPage() {
    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
                            Crear Nuevo Cliente
                        </h2>
                    </div>
                </div>

                <div className="py-4">
                    <ClientForm />
                </div>
            </div>
        </div>
    );
}
