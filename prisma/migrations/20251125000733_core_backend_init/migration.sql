-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'CONTADOR');

-- CreateEnum
CREATE TYPE "TipoRegistro" AS ENUM ('COMPRA', 'VENTA');

-- CreateEnum
CREATE TYPE "OrigenComprobante" AS ENUM ('MANUAL', 'IMPORTADO', 'API');

-- CreateEnum
CREATE TYPE "TipoImpuesto" AS ENUM ('IVA', 'IRP');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "telefono" TEXT,
    "emailContacto" TEXT,
    "urlLinkedIn" TEXT,
    "direccion" TEXT,
    "horarioAtencion" TEXT,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "actividadEconomica" TEXT,
    "impuestos" "TipoImpuesto"[],
    "digitoVerificador" INTEGER NOT NULL,
    "contadorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" SERIAL NOT NULL,
    "timbrado" TEXT NOT NULL,
    "numeroComprobante" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipoRegistro" "TipoRegistro" NOT NULL,
    "origenComprobante" "OrigenComprobante" NOT NULL,
    "rucEmisor" TEXT NOT NULL,
    "razonSocialEmisor" TEXT NOT NULL,
    "rucReceptor" TEXT NOT NULL,
    "razonSocialReceptor" TEXT NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoGravado10" DECIMAL(10,2) NOT NULL,
    "montoGravado5" DECIMAL(10,2) NOT NULL,
    "montoExento" DECIMAL(10,2) NOT NULL,
    "montoIVA10" DECIMAL(10,2) NOT NULL,
    "montoIVA5" DECIMAL(10,2) NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImputacionContable" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "impuestoTipo" "TipoImpuesto" NOT NULL,
    "montoImputable" DECIMAL(10,2) NOT NULL,
    "periodo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImputacionContable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_ruc_key" ON "Cliente"("ruc");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_contadorId_fkey" FOREIGN KEY ("contadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImputacionContable" ADD CONSTRAINT "ImputacionContable_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
