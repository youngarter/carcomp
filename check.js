const { PrismaClient } = require("./app/generated/prisma/index.js");

const prisma = new PrismaClient();

async function main() {
    const voiture = await prisma.finition.findFirst({
        where: { slug: "hyundai-hyundai-sport-premium-2025" },
        include: { technicalSpecs: true }
    });
    console.log("SAFETY", JSON.stringify(voiture.safetyFeatures, null, 2));
    console.log("COMFORT", JSON.stringify(voiture.comfortFeatures, null, 2));
    console.log("AESTHETIC", JSON.stringify(voiture.aestheticFeatures, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
