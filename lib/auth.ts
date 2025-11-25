import jwt from 'jsonwebtoken';
import { verifyPassword as verifyPwd } from './password';

// Re-export verifyPassword from password.ts for convenience
export const verifyPassword = verifyPwd;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface TokenPayload {
    id: number;
    email: string;
    rol: string;
}

/**
 * Generate a JWT token for authenticated users
 */
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
