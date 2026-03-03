"use server";

import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCar(formData: FormData) {
    const brandName = formData.get("brandName") as string;
    const modelName = formData.get("modelName") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;
    const aiScore = parseFloat(formData.get("aiScore") as string) || null;
    const reliability = parseFloat(formData.get("reliability") as string) || null;
    const maintCost = parseFloat(formData.get("maintCost") as string) || null;

    const finitionName = formData.get("finitionName") as string;
    const price = parseFloat(formData.get("price") as string);
    const finitionImage = formData.get("finitionImage") as string || image;

    // Technical specs
    const motorisation = formData.get("motorisation") as string;
    const energy = formData.get("energy") as string;
    const power = parseInt(formData.get("power") as string) || null;
    const transmission = formData.get("transmission") as string;
    const acceleration = parseFloat(formData.get("acceleration") as string) || null;
    const maxSpeed = parseInt(formData.get("maxSpeed") as string) || null;
    const consoMixed = parseFloat(formData.get("consoMixed") as string) || null;
    const co2Emission = parseInt(formData.get("co2Emission") as string) || null;

    try {
        // 1. Get or create brand
        const brand = await prisma.brand.upsert({
            where: { name: brandName },
            update: {},
            create: { name: brandName },
        });

        // 2. Create CarModel and Finition in a transaction
        await prisma.carModel.create({
            data: {
                name: modelName,
                brandId: brand.id,
                category,
                image,
                aiScore,
                reliability,
                maintCost,
                finitions: {
                    create: {
                        name: finitionName,
                        price,
                        image: finitionImage,
                        motorisation,
                        energy,
                        power,
                        transmission,
                        acceleration,
                        maxSpeed,
                        consoMixed,
                        co2Emission,
                    },
                },
            },
        });

        revalidatePath("/");
    } catch (error) {
        console.error("Failed to create car:", error);
        return { error: "Failed to create car." };
    }

    redirect("/");
}

export async function getBrands() {
    try {
        return await prisma.brand.findMany({
            orderBy: { name: "asc" },
        });
    } catch (error) {
        console.error("Failed to fetch brands:", error);
        return [];
    }
}

export async function getModelsByBrand(brandId: string) {
    try {
        return await prisma.carModel.findMany({
            where: { brandId },
            orderBy: { name: "asc" },
        });
    } catch (error) {
        console.error("Failed to fetch models:", error);
        return [];
    }
}

export async function getFinitionsByModel(carModelId: string) {
    try {
        return await prisma.finition.findMany({
            where: { carModelId },
            orderBy: { name: "asc" },
        });
    } catch (error) {
        console.error("Failed to fetch finitions:", error);
        return [];
    }
}

export async function getFinitionCatalog() {
    try {
        return await prisma.finition.findMany({
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        console.error("Failed to fetch catalog:", error);
        return [];
    }
}

export async function createCarStepByStep(data: any) {
    const {
        brandId, brandName,
        modelId, modelName, category, image, price, finitionName,
        year, finitionId,
        aiScore, reliability, maintCost,
        images, youtubeVideo,
        ...specs
    } = data;

    try {
        // --- SECURITY & VALIDATION ---
        if (!finitionName || !price) {
            return { error: "Le nom de la finition et le prix sont obligatoires." };
        }

        // Validate YouTube URL
        let finalYoutube = youtubeVideo;
        if (finalYoutube && !finalYoutube.includes("youtube.com") && !finalYoutube.includes("youtu.be")) {
            return { error: "L'URL YouTube est invalide." };
        }

        // --- DATABASE LOGIC ---
        console.log("Creating/Fetching Brand:", { brandId, brandName });
        console.log("Creating/Fetching Brand:", { brandId, brandName });
        let finalBrandId = brandId;
        if (!finalBrandId && brandName) {
            const brand = await prisma.brand.upsert({
                where: { name: brandName },
                update: {},
                create: { name: brandName },
            });
            finalBrandId = brand.id;
        }

        if (!finalBrandId) {
            console.error("Missing Brand information");
            return { error: "La marque est obligatoire." };
        }

        // 2. Get or create model
        console.log("Creating/Fetching Model:", { modelId, modelName, finalBrandId });
        let finalModelId = modelId;
        if (!finalModelId && modelName) {
            const model = await prisma.carModel.create({
                data: {
                    name: modelName,
                    brandId: finalBrandId,
                    category: category || "SUV",
                    image: image || "",
                    aiScore: parseFloat(aiScore) || 8.0,
                    reliability: parseFloat(reliability) || 8.0,
                    maintCost: parseFloat(maintCost) || 0,
                },
            });
            finalModelId = model.id;
        }

        if (!finalModelId) {
            console.error("Missing Model information");
            return { error: "Le modèle est obligatoire." };
        }

        // 3. Create Finition
        console.log("Creating Finition for model:", finalModelId);

        // Explicit lists for type safety
        const floatFields = ["price", "consoCity", "consoRoad", "consoMixed", "acceleration", "batteryCapacity"];
        const intFields = [
            "year", "fiscalPower", "cylindree", "coupleMax", "power", "co2Emission", "maxSpeed",
            "seats", "weight", "length", "width", "height", "wheelbase",
            "tankVolume", "trunkVolume", "airbags", "powerThermique", "powerElec"
        ];

        const processedSpecs: any = {};
        for (const [key, value] of Object.entries(specs)) {
            if (value === true || value === "true") {
                processedSpecs[key] = true;
            } else if (value === false || value === "false") {
                processedSpecs[key] = false;
            } else if (intFields.includes(key)) {
                processedSpecs[key] = value ? parseInt(String(value)) : null;
            } else if (floatFields.includes(key)) {
                processedSpecs[key] = value ? parseFloat(String(value)) : null;
            } else {
                processedSpecs[key] = value || null;
            }
        }

        await prisma.finition.create({
            data: {
                name: finitionName,
                carModelId: finalModelId,
                price: parseFloat(price) || 0,
                year: parseInt(specs.year) || null,
                image: image || "",
                images: Array.isArray(images) ? images.filter(img => !!img) : [],
                youtubeVideo: finalYoutube || null,
                ...processedSpecs
            },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create car step-by-step:", error);
        return { error: error.message || "Erreur interne lors de la création." };
    }
}
