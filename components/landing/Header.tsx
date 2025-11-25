import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-slate-900 shadow-lg sticky top-0 z-50 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200">
                            ACIA Contabilidad
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="#servicios" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Servicios
                        </Link>
                        <Link href="#nosotros" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Nosotros
                        </Link>
                        <Link href="#contacto" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            Contacto
                        </Link>
                    </nav>
                    <div className="flex items-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Acceso Contadores
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
