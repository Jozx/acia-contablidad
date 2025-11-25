import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchConfiguracion } from '../../lib/configuracion';
import { prismaMock } from '../../lib/prisma.mock';

describe('fetchConfiguracion', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should return configuration when it exists', async () => {
        const mockConfig = {
            id: 1,
            telefono: '123456789',
            emailContacto: 'test@example.com',
            urlLinkedIn: 'https://linkedin.com/in/test',
            direccion: 'Test Address',
            horarioAtencion: '9:00 - 18:00',
        };

        prismaMock.configuracion.findFirst.mockResolvedValue(mockConfig);

        const result = await fetchConfiguracion();

        expect(result).toEqual(mockConfig);
        expect(prismaMock.configuracion.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should return null when configuration does not exist', async () => {
        prismaMock.configuracion.findFirst.mockResolvedValue(null);

        const result = await fetchConfiguracion();

        expect(result).toBeNull();
    });

    it('should return null on error', async () => {
        prismaMock.configuracion.findFirst.mockRejectedValue(new Error('DB Error'));

        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const result = await fetchConfiguracion();

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
