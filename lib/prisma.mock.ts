import { PrismaClient } from '@prisma/client'
import { mockReset, DeepMockProxy } from 'vitest-mock-extended'
import { beforeEach } from 'vitest'

import { prisma } from '@/lib/prisma'

beforeEach(() => {
    mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
