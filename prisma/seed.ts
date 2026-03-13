import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("🚀 Début du seeding...");

    // 1. Nettoyage de la base de données
    await prisma.finitionPriceHistory.deleteMany();
    await prisma.review.deleteMany();
    await prisma.priceHistory.deleteMany();
    await prisma.finition.deleteMany();
    await prisma.carModel.deleteMany();
    await prisma.brand.deleteMany();

    const brandsData = [
        { name: "Toyota", origin: "Japon", domain: "toyota.com" },
        { name: "Volkswagen", origin: "Allemagne", domain: "volkswagen.com" },
        { name: "BMW", origin: "Allemagne", domain: "bmw.com" },
        { name: "Mercedes-Benz", origin: "Allemagne", domain: "mercedes-benz.com" },
        { name: "Hyundai", origin: "Corée du Sud", domain: "hyundai.com" },
        { name: "Kia", origin: "Corée du Sud", domain: "kia.com" },
        { name: "Dacia", origin: "Roumanie (Groupe Renault)", domain: "dacia.com" },
        { name: "Peugeot", origin: "France", domain: "peugeot.com" },
        { name: "Renault", origin: "France", domain: "renault.com" },
        { name: "Tesla", origin: "USA", domain: "tesla.com" },
    ];

    const categories = ["Citadine", "Compacte", "SUV", "Berline", "Electrique"];

    const modelsByBrand: Record<string, any[]> = {
        Toyota: [
            { name: "Yaris", cat: "Citadine", img: "https://images.unsplash.com/photo-1621335381773-4f9a3993e50b" },
            { name: "Corolla", cat: "Compacte", img: "https://images.unsplash.com/photo-1623101691157-550608632616" },
            { name: "RAV4", cat: "SUV", img: "https://images.unsplash.com/photo-1606248358210-67634f191f63" },
        ],
        BMW: [
            { name: "Serie 1", cat: "Compacte", img: "https://images.unsplash.com/photo-1556122071-e404970c7ff2" },
            { name: "Serie 3", cat: "Berline", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e" },
            { name: "X1", cat: "SUV", img: "https://images.unsplash.com/photo-1619330085626-444498308871" },
        ],
        Dacia: [
            { name: "Sandero", cat: "Citadine", img: "https://images.unsplash.com/photo-1655716173007-8854087e3831" },
            { name: "Duster", cat: "SUV", img: "https://images.unsplash.com/photo-1551522435-a13afa10f103" },
        ],
        Tesla: [
            { name: "Model 3", cat: "Electrique", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89" },
            { name: "Model Y", cat: "SUV", img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a" },
        ],
        Peugeot: [
            { name: "208", cat: "Citadine", img: "https://images.unsplash.com/photo-1611016186353-9af58c69a533" },
            { name: "3008", cat: "SUV", img: "https://images.unsplash.com/photo-1622321453401-496359569651" },
        ],
    };

    const allFinitions = ["Active", "Style", "Premium", "Luxury", "M Sport", "GT Line"];

    for (const b of brandsData) {
        const brand = await prisma.brand.create({
            data: {
                name: b.name,
                slug: b.name.toLowerCase().replace(" ", "-"),
                origin: b.origin,
                logo: `https://logo.clearbit.com/${b.domain}`,
                logoAlt: `${b.name} official logo`,
                description: `${b.name} est un constructeur automobile majeur proposant des véhicules fiables et innovants.`,
            },
        });

        // Modèles par défaut si non spécifiés dans modelsByBrand
        const modelsToCreate = modelsByBrand[b.name] || [
            { name: `${b.name} Model A`, cat: "Compacte", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70" },
            { name: `${b.name} Model B`, cat: "SUV", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf" },
        ];

        for (const m of modelsToCreate) {
            const startPrice = m.cat === "Citadine" ? 140000 : m.cat === "SUV" ? 320000 : 250000;

            const carModel = await prisma.carModel.create({
                data: {
                    name: m.name,
                    slug: `${brand.slug}-${m.name.toLowerCase().replace(" ", "-")}`,
                    brandId: brand.id,
                    category: m.cat,
                    image: m.img,
                    aiScore: 7.0 + Math.random() * 2,
                    reliability: b.name === "Toyota" ? 9.0 : 7.0 + Math.random() * 2,
                    maintCost: b.name === "BMW" ? 8.5 : 5.0 + Math.random() * 3,
                    startPrice: startPrice,
                    endPrice: startPrice * 1.5,
                },
            });

            // Price History
            for (const year of [2023, 2024, 2025]) {
                await prisma.priceHistory.create({
                    data: {
                        carModelId: carModel.id,
                        year,
                        startPrice: startPrice * (0.9 + (year - 2023) * 0.05),
                        endPrice: startPrice * 1.4 * (0.9 + (year - 2023) * 0.05),
                    },
                });
            }

            // Reviews
            await prisma.review.createMany({
                data: [
                    {
                        carModelId: carModel.id,
                        rating: 4,
                        comment: `Très satisfait de ma ${m.name}, excellente tenue de route.`,
                        userName: "Mehdi Alami",
                        status: "APPROVED",
                    },
                    {
                        carModelId: carModel.id,
                        rating: 5,
                        comment: "Rapport qualité/prix imbattable pour le marché marocain.",
                        userName: "Sara Tazi",
                        status: "APPROVED",
                    },
                    {
                        carModelId: carModel.id,
                        rating: 4,
                        comment: `Analyse IA : Ce modèle excelle par son efficacité énergétique et sa valeur de revente.`,
                        isAiSummary: true,
                        status: "APPROVED",
                    },
                ],
            });

            // Finitions (Trims)
            const numTrims = Math.floor(Math.random() * 2) + 1; // 1 to 2 trims
            for (let i = 0; i < numTrims; i++) {
                const trimName = allFinitions[i];
                const isElectric = m.cat === "Electrique";

                const finition = await prisma.finition.create({
                    data: {
                        name: trimName,
                        slug: `${carModel.slug}-${trimName.toLowerCase()}`,
                        carModelId: carModel.id,
                        startPrice: startPrice + i * 40000,
                        energy: isElectric ? "Electrique" : "Hybride",
                        transmission: "Automatique",
                        power: isElectric ? 204 : 115 + i * 20,
                        acceleration: isElectric ? 7.2 : 9.5,
                        maxSpeed: isElectric ? 160 : 190,
                        consoMixed: isElectric ? 0 : 4.5,
                        co2Emission: isElectric ? 0 : 110,
                        abs: true,
                        esp: true,
                        isofix: true,
                        cameraRecul: i > 0, // Uniquement sur les finitions hautes
                        ecranTactile: true,
                        navigationGps: i > 0,
                        appleCarplay: true,
                        image: m.img,
                        images: [m.img, m.img, m.img],
                    },
                });

                // Ajouter une promotion aléatoire (1 chance sur 6)
                if (Math.random() > 0.85) {
                    await prisma.finitionPriceHistory.create({
                        data: {
                            finitionId: finition.id,
                            price: finition.startPrice || 0,
                            isPromotion: true,
                            promotionalPrice: (finition.startPrice || 0) * 0.92, // -8%
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
                        },
                    });
                    await prisma.finition.update({
                        where: { id: finition.id },
                        data: { isPromoted: true },
                    });
                }
            }
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
    });