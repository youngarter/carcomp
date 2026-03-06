/*
  Warnings:

  - You are about to drop the column `pharesLed` on the `Finition` table. All the data in the column will be lost.
  - You are about to drop the column `toitOuvrant` on the `Finition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Finition" DROP COLUMN "pharesLed",
DROP COLUMN "toitOuvrant",
ADD COLUMN     "affichageTeteHaute" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "alarme" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "banquetteRabattable" TEXT,
ADD COLUMN     "barresToit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "batteryCapacity" DOUBLE PRECISION,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "chargeurSansFil" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cockpitDigital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "coffreElectrique" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commandesVocales" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commandesVolant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "detecteurPluie" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "detecteurSousGonflage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emplacement" TEXT,
ADD COLUMN     "fermetureAuto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "feuxJour" TEXT,
ADD COLUMN     "followMeHome" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "lumiereAmbiance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mainsLibres" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modeConduite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "palettesVolant" TEXT,
ADD COLUMN     "parkAssist" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phares" TEXT,
ADD COLUMN     "pharesAntibrouillard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "powerElec" INTEGER,
ADD COLUMN     "powerThermique" INTEGER,
ADD COLUMN     "reconnaissancePanneaux" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "retrosElectriques" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "retrosRabattables" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "siegesElectriques" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "siegesMemoire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "toit" TEXT,
ADD COLUMN     "vitresElectriques" TEXT,
ADD COLUMN     "volantReglable" TEXT,
ADD COLUMN     "wifi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "year" INTEGER,
ADD COLUMN     "youtubeVideo" TEXT;
