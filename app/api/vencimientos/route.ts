import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tabla de vencimientos según dígito del RUC (SET Paraguay)
// Mapeo: último dígito de la parte numérica del RUC -> día de vencimiento
const VENCIMIENTOS_MAP: Record<number, number> = {
    0: 7,
    1: 9,
    2: 11,
    3: 13,
    4: 15,
    5: 17,
    6: 19,
    7: 21,
    8: 23,
    9: 25,
};

// Lista de feriados para Paraguay (puede ser ampliada)
// Formato: 'YYYY-MM-DD'
const HOLIDAYS_2025: string[] = [
    '2025-01-01', // Año Nuevo
    '2025-03-01', // Día de los Héroes
    '2025-04-17', // Jueves Santo
    '2025-04-18', // Viernes Santo
    '2025-05-01', // Día del Trabajador
    '2025-05-15', // Independencia Nacional
    '2025-06-12', // Paz del Chaco
    '2025-08-15', // Fundación de Asunción
    '2025-09-29', // Victoria de Boquerón
    '2025-12-08', // Virgen de Caacupé
    '2025-12-25', // Navidad
];

/**
 * Verifica si una fecha es fin de semana
 */
function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}

/**
 * Verifica si una fecha es feriado
 */
function isHoliday(date: Date, holidays: string[]): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.includes(dateStr);
}

/**
 * Avanza la fecha al siguiente día hábil
 */
function getNextBusinessDay(date: Date, holidays: string[]): Date {
    const nextDay = new Date(date);

    while (isWeekend(nextDay) || isHoliday(nextDay, holidays)) {
        nextDay.setDate(nextDay.getDate() + 1);
    }

    return nextDay;
}

/**
 * Calcula la próxima fecha de vencimiento hábil basada en el dígito del RUC
 * @param digitoVencimientoRUC - Último dígito de la parte numérica del RUC (0-9)
 * @param currentDate - Fecha actual
 * @param holidays - Lista de feriados en formato 'YYYY-MM-DD'
 * @returns Próxima fecha de vencimiento hábil
 */
function calculateNextDueDate(
    digitoVencimientoRUC: number,
    currentDate: Date,
    holidays: string[]
): Date {
    const diaVencimiento = VENCIMIENTOS_MAP[digitoVencimientoRUC];

    if (diaVencimiento === undefined) {
        throw new Error(`Dígito de RUC inválido: ${digitoVencimientoRUC}`);
    }

    const today = new Date(currentDate);
    const currentDay = today.getDate();

    // Determinar el mes y año del vencimiento
    let targetMonth = today.getMonth();
    let targetYear = today.getFullYear();

    // Si ya pasó el día de vencimiento de este mes, el vencimiento es el mes siguiente
    if (currentDay >= diaVencimiento) {
        targetMonth += 1;
        if (targetMonth > 11) {
            targetMonth = 0;
            targetYear += 1;
        }
    }

    // Crear la fecha de vencimiento inicial
    const dueDate = new Date(targetYear, targetMonth, diaVencimiento);

    // Ajustar al siguiente día hábil si cae en fin de semana o feriado
    return getNextBusinessDay(dueDate, holidays);
}

export async function GET() {
    try {
        const currentDate = new Date();
        const sevenDaysLater = new Date(currentDate);
        sevenDaysLater.setDate(currentDate.getDate() + 7);

        // Obtener todos los clientes
        const clientes = await prisma.cliente.findMany({
            include: {
                contador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
            },
        });

        // Filtrar clientes con vencimientos próximos
        const clientesConVencimientos = clientes
            .map((cliente) => {
                const proximaFechaVencimientoHabil = calculateNextDueDate(
                    cliente.digitoVencimiento,
                    currentDate,
                    HOLIDAYS_2025
                );

                return {
                    ...cliente,
                    proximaFechaVencimientoHabil: proximaFechaVencimientoHabil.toISOString(),
                };
            })
            .filter((cliente) => {
                const fechaVencimiento = new Date(cliente.proximaFechaVencimientoHabil);
                return fechaVencimiento >= currentDate && fechaVencimiento <= sevenDaysLater;
            });

        return NextResponse.json(clientesConVencimientos);
    } catch (error) {
        console.error('Error calculando vencimientos:', error);
        return NextResponse.json(
            { error: 'Error al calcular vencimientos' },
            { status: 500 }
        );
    }
}
