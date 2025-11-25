'use client';

export interface UserSession {
    id: number;
    email: string;
    nombre: string;
    rol: string;
}

const SESSION_KEY = 'acia_session';

export function saveSession(user: UserSession): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
}

export function getSession(): UserSession | null {
    if (typeof window !== 'undefined') {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
            try {
                return JSON.parse(session);
            } catch {
                return null;
            }
        }
    }
    return null;
}

export function clearSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_KEY);
    }
}

export function isAuthenticated(): boolean {
    return getSession() !== null;
}
