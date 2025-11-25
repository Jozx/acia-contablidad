/*
  Warnings:

  - Added the required column `digitoVencimiento` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add digitoVencimiento column (nullable first)
ALTER TABLE "Cliente" ADD COLUMN "digitoVencimiento" INTEGER;

-- Copy existing digitoVerificador values to digitoVencimiento
UPDATE "Cliente" SET "digitoVencimiento" = "digitoVerificador";

-- Make digitoVencimiento NOT NULL
ALTER TABLE "Cliente" ALTER COLUMN "digitoVencimiento" SET NOT NULL;
