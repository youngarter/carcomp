/*
  Warnings:

  - You are about to drop the column `category` on the `Finition` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Finition` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `finitionId` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `isPromotion` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `promotionalPrice` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PriceHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserPreference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carModelId` to the `PriceHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `PriceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PriceHistory" DROP CONSTRAINT "PriceHistory_finitionId_fkey";

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "imageAlt" TEXT,
ADD COLUMN     "logoAlt" TEXT,
ADD COLUMN     "origin" TEXT;

-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "endPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "startPrice" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Finition" DROP COLUMN "category",
DROP COLUMN "price",
ADD COLUMN     "critAir" INTEGER,
ADD COLUMN     "driveTrain" TEXT,
ADD COLUMN     "endPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "startPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "warranty" TEXT;

-- AlterTable
ALTER TABLE "HeroSlide" ADD COLUMN     "imageAlt" TEXT,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "subtitle" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PriceHistory" DROP COLUMN "endDate",
DROP COLUMN "finitionId",
DROP COLUMN "isPromotion",
DROP COLUMN "price",
DROP COLUMN "promotionalPrice",
DROP COLUMN "startDate",
ADD COLUMN     "carModelId" TEXT NOT NULL,
ADD COLUMN     "endPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "startPrice" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "FinitionPriceHistory" (
    "id" TEXT NOT NULL,
    "finitionId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isPromotion" BOOLEAN NOT NULL DEFAULT false,
    "promotionalPrice" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinitionPriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinitionPriceHistory" ADD CONSTRAINT "FinitionPriceHistory_finitionId_fkey" FOREIGN KEY ("finitionId") REFERENCES "Finition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
