import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-gradient-to-b from-white to-slate-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-5xl tracking-tight font-extrabold text-slate-900 sm:text-6xl md:text-7xl">
                                <span className="block">Gestión contable</span>
                                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    inteligente y simple
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-slate-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                                Optimiza tus procesos contables con nuestra plataforma integral. Facturación, impuestos y reportes en un solo lugar.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                                <div className="rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                    <Link
                                        href="/login"
                                        className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 md:py-4 md:text-lg transition-all duration-200 transform hover:-translate-y-1"
                                    >
                                        Comenzar ahora
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0">
                                    <Link
                                        href="#contacto"
                                        className="w-full flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-base font-semibold rounded-lg text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                    >
                                        Contáctanos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                {/* Placeholder for Hero Image - using a pattern or abstract shape for now */}
                <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="mt-4 text-slate-400 font-medium">Gestión Profesional</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
