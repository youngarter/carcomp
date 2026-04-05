-- AlterTable
ALTER TABLE "Finition" ADD COLUMN     "androidAuto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "generationId" TEXT;

-- CreateTable
CREATE TABLE "CarGeneration" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "phaseType" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinitionEquipment" (
    "finitionId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "isStandard" BOOLEAN NOT NULL DEFAULT true,
    "optionPrice" DOUBLE PRECISION,

    CONSTRAINT "FinitionEquipment_pkey" PRIMARY KEY ("finitionId","equipmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarGeneration_slug_key" ON "CarGeneration"("slug");

-- AddForeignKey
ALTER TABLE "CarGeneration" ADD CONSTRAINT "CarGeneration_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finition" ADD CONSTRAINT "Finition_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "CarGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinitionEquipment" ADD CONSTRAINT "FinitionEquipment_finitionId_fkey" FOREIGN KEY ("finitionId") REFERENCES "Finition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinitionEquipment" ADD CONSTRAINT "FinitionEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
