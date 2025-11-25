import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'vitest-mock-extended'
import { vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
}))

vi.mock('./lib/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
}))
