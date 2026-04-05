import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🚀 Début du seeding de la nouvelle structure...");

    // 1. Nettoyage de la base de données (Note: Order matters for Cascades)
    // FinitionPriceHistory depends on Finition
    await prisma.finitionPriceHistory.deleteMany();
    // TechnicalSpec depends on Finition
    await prisma.technicalSpec.deleteMany();
    // Review depends on CarModel
    await prisma.review.deleteMany();
    // Finition depends on CarModel and CarGeneration
    await prisma.finition.deleteMany();
    // CarGeneration depends on CarModel
    await prisma.carGeneration.deleteMany();
    // CarModel depends on Brand
    await prisma.carModel.deleteMany();
    await prisma.brand.deleteMany();

    const brandsData = [
        { name: "Toyota", origin: "Japon", domain: "toyota.com" },
        { name: "Volkswagen", origin: "Allemagne", domain: "volkswagen.com" },
        { name: "Tesla", origin: "USA", domain: "tesla.com" },
        { name: "BMW", origin: "Allemagne", domain: "bmw.com" },
        { name: "Hyundai", origin: "Corée du Sud", domain: "hyundai.com" },
    ];

    for (const b of brandsData) {
        const brand = await prisma.brand.create({
            data: {
                name: b.name,
                slug: b.name.toLowerCase().replace(" ", "-"),
                origin: b.origin,
                logo: `https://logo.clearbit.com/${b.domain}`,
                description: `${b.name} est un constructeur automobile majeur proposant des véhicules fiables et innovants.`,
            },
        });

        // Create a Model
        const modelName = b.name === "Tesla" ? "Model 3" : b.name === "Toyota" ? "RAV4" : `${b.name} Sport`;
        const carModel = await prisma.carModel.create({
            data: {
                name: modelName,
                slug: `${brand.slug}-${modelName.toLowerCase().replace(" ", "-")}`,
                brandId: brand.id,
                category: b.name === "Tesla" || b.name === "BMW" ? "BERLINE" : "SUV",
                image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
                aiScore: 8.5,
                reliability: 9.0,
                maintCost: 500,
            },
        });

        // Create a Generation
        const nextYear = 2025;
        const genSlug = `${carModel.slug}-gen-2025`;
        const generation = await prisma.carGeneration.create({
            data: {
                name: `${carModel.name} Generation 2025`,
                slug: genSlug,
                carModelId: carModel.id,
                startYear: 2024,
                phaseType: "new",
                isCurrent: true,
            }
        });

        // Create a Finition
        const basePrice = b.name === "Tesla" ? 450000 : 350000;
        const finition = await prisma.finition.create({
            data: {
                name: "Premium",
                slug: `${carModel.slug}-premium-2025`,
                carModelId: carModel.id,
                generationId: generation.id,
                basePrice: basePrice,
                year: 2025,
                images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70"],
                isPromoted: b.name === "Tesla",
                
                // Technical Specs (Relation)
                technicalSpecs: {
                    create: {
                        fuelType: b.name === "Tesla" ? "ELECTRIQUE" : "HYBRIDE",
                        transmission: "AUTOMATIQUE",
                        dinPower: b.name === "Tesla" ? 283 : 218,
                        fiscalPower: 8,
                        engineDisplacement: b.name === "Tesla" ? 0 : 2487,
                        maxTorque: b.name === "Tesla" ? 450 : 221,
                        acceleration: b.name === "Tesla" ? 6.1 : 8.1,
                        topSpeed: b.name === "Tesla" ? 225 : 180,
                        consoMixed: b.name === "Tesla" ? 14.4 : 4.4,
                        co2Emission: 0,
                        seats: 5,
                        tankVolume: b.name === "Tesla" ? 0 : 55,
                        trunkVolume: 580,
                    }
                },
                
                // Features (JSON fields)
                safetyFeatures: {
                    abs: true,
                    esp: true,
                    airbags: 8,
                    laneAssist: true,
                    blindSpotMonitor: true,
                    isofix: true,
                },
                comfortFeatures: {
                    airConditioning: "AUTO",
                    appleCarplay: true,
                    androidAuto: true,
                    bluetooth: true,
                    navigation: true,
                    parkingSensors: "FRONT_REAR",
                    rearCamera: true,
                    cruiseControl: "ADAPTIVE",
                },
                aestheticFeatures: {
                    alloyWheels: "18 pouces",
                    leatherSteeringWheel: true,
                    ledHeadlights: true,
                    ambientLighting: true,
                },
            }
        });

        // Add a Price History entry if promoted
        if (finition.isPromoted) {
            await prisma.finitionPriceHistory.create({
                data: {
                    finitionId: finition.id,
                    price: basePrice,
                    isPromotion: true,
                    promotionalPrice: basePrice * 0.95,
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000),
                }
            });
        }
    }

    console.log("✅ Seeding terminé avec succès !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });