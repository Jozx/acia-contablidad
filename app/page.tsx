import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';
import { fetchConfiguracion } from '@/lib/configuracion';

export const dynamic = 'force-dynamic'; // Ensure fresh data if configuration changes

export default async function LandingPage() {
  const configuracion = await fetchConfiguracion();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Footer configuracion={configuracion} />
    </div>
  );
}
