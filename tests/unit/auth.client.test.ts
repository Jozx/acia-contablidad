import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveSession, getSession, clearSession, isAuthenticated, UserSession } from '../../lib/auth.client';

describe('Auth Client Helpers', () => {
    const mockSession: UserSession = {
        id: 1,
        email: 'test@example.com',
        nombre: 'Test User',
        rol: 'ADMIN',
    };

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('saveSession', () => {
        it('should save session to localStorage', () => {
            saveSession(mockSession);
            const stored = localStorage.getItem('acia_session');
            expect(stored).toBeDefined();
            expect(JSON.parse(stored!)).toEqual(mockSession);
        });
    });

    describe('getSession', () => {
        it('should return session from localStorage', () => {
            localStorage.setItem('acia_session', JSON.stringify(mockSession));
            const session = getSession();
            expect(session).toEqual(mockSession);
        });

        it('should return null when no session exists', () => {
            const session = getSession();
            expect(session).toBeNull();
        });

        it('should return null when session is invalid JSON', () => {
            localStorage.setItem('acia_session', 'invalid-json');
            const session = getSession();
            expect(session).toBeNull();
        });
    });

    describe('clearSession', () => {
        it('should remove session from localStorage', () => {
            localStorage.setItem('acia_session', JSON.stringify(mockSession));
            clearSession();
            const stored = localStorage.getItem('acia_session');
            expect(stored).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when session exists', () => {
            localStorage.setItem('acia_session', JSON.stringify(mockSession));
            expect(isAuthenticated()).toBe(true);
        });

        it('should return false when no session exists', () => {
            expect(isAuthenticated()).toBe(false);
        });
    });
});
