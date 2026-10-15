-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "subcategoria_id" INTEGER;

-- CreateTable
CREATE TABLE "subcategorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "subcategorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subcategorias_slug_key" ON "subcategorias"("slug");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_subcategoria_id_fkey" FOREIGN KEY ("subcategoria_id") REFERENCES "subcategorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategorias" ADD CONSTRAINT "subcategorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
