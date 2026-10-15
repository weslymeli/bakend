/*
  Warnings:

  - A unique constraint covering the columns `[codigoReferido]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "codigoReferido" TEXT,
ADD COLUMN     "creditoDisponible" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "referidoPorId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_codigoReferido_key" ON "usuarios"("codigoReferido");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_referidoPorId_fkey" FOREIGN KEY ("referidoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
