import { describe, it, expect, vi } from 'vitest'
import { prismaMock } from '../../lib/prisma.mock'
import { RolUsuario } from '@prisma/client'

// Example function to test
async function createUser(name: string, email: string) {
    return await prismaMock.usuario.create({
        data: {
            nombre: name,
            email: email,
            password: 'password', // In a real app, this would be hashed
            rol: 'ADMIN',
        },
    })
}

describe('Prisma Example Test', () => {
    it('should create a new user', async () => {
        const user = {
            id: 1,
            nombre: 'Test User',
            email: 'test@example.com',
            password: 'password',
            rol: 'ADMIN' as RolUsuario,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        prismaMock.usuario.create.mockResolvedValue(user)

        await expect(createUser('Test User', 'test@example.com')).resolves.toEqual(user)
    })
})
