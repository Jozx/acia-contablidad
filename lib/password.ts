import bcrypt from 'bcryptjs';

/**
 * Generate a secure random password
 * Format: 3 words + 3 numbers + 1 special char
 * Example: "Cloud7Sky2Rain!5"
 */
export function generateSecurePassword(): string {
    const words = [
        'Cloud', 'River', 'Mountain', 'Ocean', 'Forest', 'Desert',
        'Storm', 'Thunder', 'Lightning', 'Rainbow', 'Sunset', 'Sunrise',
        'Star', 'Moon', 'Sun', 'Wind', 'Rain', 'Snow'
    ];

    const specialChars = '!@#$%&*';

    // Pick 3 random words
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const word3 = words[Math.floor(Math.random() * words.length)];

    // Generate 3 random numbers
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const num3 = Math.floor(Math.random() * 10);

    // Pick 1 random special character
    const special = specialChars[Math.floor(Math.random() * specialChars.length)];

    // Combine: Word1 + num1 + Word2 + num2 + special + Word3 + num3
    return `${word1}${num1}${word2}${num2}${special}${word3}${num3}`;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
