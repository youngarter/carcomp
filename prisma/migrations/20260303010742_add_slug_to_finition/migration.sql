/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Finition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Finition" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Finition_slug_key" ON "Finition"("slug");
