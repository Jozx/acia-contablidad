import { prisma } from '@/lib/prisma';
import { Configuracion } from '@prisma/client';

export async function fetchConfiguracion(): Promise<Configuracion | null> {
    try {
        const config = await prisma.configuracion.findFirst();
        return config;
    } catch (error) {
        console.error('Error fetching configuracion:', error);
        return null;
    }
}
