import { Configuracion } from '@prisma/client';

interface FooterProps {
    configuracion: Configuracion | null;
}

export default function Footer({ configuracion }: FooterProps) {
    return (
        <footer className="bg-slate-900 border-t border-slate-800" id="contacto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            ACIA Contabilidad
                        </span>
                        <p className="text-slate-400 text-base leading-relaxed">
                            Soluciones contables integrales para tu negocio.
                        </p>
                        <div className="flex space-x-6">
                            {configuracion?.urlLinkedIn && (
                                <a
                                    href={configuracion.urlLinkedIn}
                                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                                    Contacto
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    {configuracion?.emailContacto && (
                                        <li>
                                            <a
                                                href={`mailto:${configuracion.emailContacto}`}
                                                className="text-base text-slate-400 hover:text-white transition-colors duration-200"
                                            >
                                                {configuracion.emailContacto}
                                            </a>
                                        </li>
                                    )}
                                    {configuracion?.telefono && (
                                        <li>
                                            <span className="text-base text-slate-400">
                                                {configuracion.telefono}
                                            </span>
                                        </li>
                                    )}
                                    {configuracion?.direccion && (
                                        <li>
                                            <span className="text-base text-slate-400">
                                                {configuracion.direccion}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                                    Horario
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    {configuracion?.horarioAtencion && (
                                        <li>
                                            <span className="text-base text-slate-400">
                                                {configuracion.horarioAtencion}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-800 pt-8">
                    <p className="text-base text-slate-400 xl:text-center">
                        &copy; {new Date().getFullYear()} ACIA Contabilidad. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
