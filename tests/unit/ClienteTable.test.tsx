import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ClienteTable from '../../components/dashboard/ClienteTable';
import { Cliente, TipoImpuesto } from '@prisma/client';

describe('ClienteTable', () => {
    const mockClientes: Cliente[] = [
        {
            id: 1,
            ruc: '12345678',
            razonSocial: 'Empresa A',
            actividadEconomica: 'Venta de Software',
            impuestos: [TipoImpuesto.IVA],
            digitoVencimiento: 8,
            digitoVerificador: 9,
            contadorId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            ruc: '87654321',
            razonSocial: 'Empresa B',
            actividadEconomica: 'Consultoría',
            impuestos: [TipoImpuesto.IVA, TipoImpuesto.IRP],
            digitoVencimiento: 1,
            digitoVerificador: 5,
            contadorId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    it('should render a table with clients', () => {
        render(<ClienteTable clientes={mockClientes} />);

        expect(screen.getByText('Empresa A')).toBeDefined();
        expect(screen.getByText('12345678-9')).toBeDefined();
        expect(screen.getByText('Venta de Software')).toBeDefined();
        // IVA appears multiple times, so we check if it exists in the document
        expect(screen.getAllByText('IVA').length).toBeGreaterThan(0);

        expect(screen.getByText('Empresa B')).toBeDefined();
        expect(screen.getByText('87654321-5')).toBeDefined();
        expect(screen.getByText('Consultoría')).toBeDefined();
        expect(screen.getAllByText('IVA')).toHaveLength(2); // One for each client
        expect(screen.getByText('IRP')).toBeDefined();
    });

    it('should render empty table when no clients', () => {
        render(<ClienteTable clientes={[]} />);

        expect(screen.queryByText('Empresa A')).toBeNull();
    });
});
