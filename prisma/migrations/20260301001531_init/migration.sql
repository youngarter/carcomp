-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "aiScore" DOUBLE PRECISION,
    "reliability" DOUBLE PRECISION,
    "maintCost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "motorisation" TEXT,
    "energy" TEXT,
    "fiscalPower" INTEGER,
    "transmission" TEXT,
    "architecture" TEXT,
    "cylindree" INTEGER,
    "coupleMax" INTEGER,
    "gearbox" TEXT,
    "power" INTEGER,
    "consoCity" DOUBLE PRECISION,
    "consoRoad" DOUBLE PRECISION,
    "consoMixed" DOUBLE PRECISION,
    "co2Emission" INTEGER,
    "maxSpeed" INTEGER,
    "acceleration" DOUBLE PRECISION,
    "bodyType" TEXT,
    "seats" INTEGER,
    "weight" INTEGER,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "wheelbase" INTEGER,
    "tankVolume" INTEGER,
    "trunkVolume" INTEGER,
    "airbags" INTEGER,
    "abs" BOOLEAN NOT NULL DEFAULT false,
    "esp" BOOLEAN NOT NULL DEFAULT false,
    "antipatinage" BOOLEAN NOT NULL DEFAULT false,
    "aideFreinageUrgence" BOOLEAN NOT NULL DEFAULT false,
    "antidemarrage" BOOLEAN NOT NULL DEFAULT false,
    "aideDemarrageCote" BOOLEAN NOT NULL DEFAULT false,
    "detecteurFatigue" BOOLEAN NOT NULL DEFAULT false,
    "maintienVoie" BOOLEAN NOT NULL DEFAULT false,
    "detecteurAngleMort" BOOLEAN NOT NULL DEFAULT false,
    "isofix" BOOLEAN NOT NULL DEFAULT false,
    "climatisation" TEXT,
    "systemeAudio" TEXT,
    "ordinateurBord" BOOLEAN NOT NULL DEFAULT false,
    "startStop" BOOLEAN NOT NULL DEFAULT false,
    "regulateurVitesse" BOOLEAN NOT NULL DEFAULT false,
    "allumageAutoFeux" BOOLEAN NOT NULL DEFAULT false,
    "freinMainElectrique" BOOLEAN NOT NULL DEFAULT false,
    "ecranTactile" BOOLEAN NOT NULL DEFAULT false,
    "cameraRecul" BOOLEAN NOT NULL DEFAULT false,
    "radarStationnement" TEXT,
    "navigationGps" BOOLEAN NOT NULL DEFAULT false,
    "bluetooth" BOOLEAN NOT NULL DEFAULT false,
    "appleCarplay" BOOLEAN NOT NULL DEFAULT false,
    "jantesAlu" TEXT,
    "sellerie" TEXT,
    "volantCuir" BOOLEAN NOT NULL DEFAULT false,
    "pharesLed" BOOLEAN NOT NULL DEFAULT false,
    "toitOuvrant" BOOLEAN NOT NULL DEFAULT false,
    "vitresSurteintees" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isAiSummary" BOOLEAN NOT NULL DEFAULT false,
    "userName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "budgetMin" DOUBLE PRECISION,
    "budgetMax" DOUBLE PRECISION,
    "usage" TEXT,
    "passengers" INTEGER,
    "priority" TEXT,
    "energy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finition" ADD CONSTRAINT "Finition_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
