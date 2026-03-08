"use server";

import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Utility to generate SEO-friendly slugs
function generateSlug(...parts: string[]): string {
    return parts
        .filter(Boolean)
        .join("-")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphen
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Trim hyphens
}

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

    const year = formData.get("year") as string;
    const slug = generateSlug(brandName, modelName, finitionName, year);

    try {
        // 1. Get or create brand
        const brandSlug = generateSlug(brandName);
        const brand = await prisma.brand.upsert({
            where: { name: brandName },
            update: {},
            create: { name: brandName, slug: brandSlug },
        });

        // 2. Create CarModel and Finition in a transaction
        const modelSlug = generateSlug(brandName, modelName);
        await prisma.carModel.create({
            data: {
                name: modelName,
                slug: modelSlug,
                brandId: brand.id,
                category,
                image,
                aiScore,
                reliability,
                maintCost,
                finitions: {
                    create: {
                        slug,
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
                priceHistories: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                }
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

export async function getFinitionBySlug(slug: string) {
    if (!slug || typeof slug !== "string") return null;
    try {
        return await prisma.finition.findUnique({
            where: { slug },
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
                priceHistories: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                }
            },
        });
    } catch (error: any) {
        console.error("Failed to fetch car by slug:", error?.message || "Unknown error");
        return null;
    }
}

import { z } from "zod";

const CarStepSchema = z.object({
    finitionName: z.string().min(1, "Le nom de la finition est obligatoire"),
    price: z.coerce.number().min(0, "Le prix doit être un nombre positif"),
    brandName: z.string().optional(),
    brandId: z.string().optional(),
    modelName: z.string().optional(),
    modelId: z.string().optional(),
    category: z.string().optional(),
    image: z.string().optional(),
    year: z.coerce.number().optional(),
    youtubeVideo: z.string().url("URL YouTube invalide").optional().or(z.literal("")),
    isPromoted: z.boolean().optional(),
    promotionalPrice: z.coerce.number().optional().nullable(),
    promoStartDate: z.string().optional().nullable(),
    promoEndDate: z.string().optional().nullable(),
});

export async function createCarStepByStep(data: any) {
    try {
        // --- SECURITY & VALIDATION ---
        const validated = CarStepSchema.safeParse(data);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        const {
            brandId, brandName,
            modelId, modelName, category, image, price, finitionName,
            year: dataYear, finitionId,
            aiScore, reliability, maintCost,
            images, youtubeVideo,
            isPromoted, promotionalPrice, promoStartDate, promoEndDate,
            ...specs
        } = data;

        // --- DATABASE LOGIC ---
        let finalBrandName = brandName;
        let finalBrandId = brandId;

        if (brandId && !brandName) {
            const b = await prisma.brand.findUnique({ where: { id: brandId } });
            finalBrandName = b?.name || "Unknown";
        }

        if (!finalBrandId && brandName) {
            const brandSlug = generateSlug(brandName);
            const brand = await prisma.brand.upsert({
                where: { name: brandName },
                update: {},
                create: { name: brandName, slug: brandSlug },
            });
            finalBrandId = brand.id;
            finalBrandName = brand.name;
        }

        if (!finalBrandId) {
            return { error: "La marque est obligatoire." };
        }

        // 2. Get or create model
        let finalModelName = modelName;
        let finalModelId = modelId;

        if (modelId && !modelName) {
            const m = await prisma.carModel.findUnique({ where: { id: modelId } });
            finalModelName = m?.name || "Unknown";
        }

        if (!finalModelId && modelName) {
            const modelSlug = generateSlug(finalBrandName, modelName);
            const model = await prisma.carModel.create({
                data: {
                    name: modelName,
                    slug: modelSlug,
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
            return { error: "Le modèle est obligatoire." };
        }

        const { year } = data;
        const slug = generateSlug(finalBrandName, finalModelName, finitionName, year);

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

        const newFinition = await prisma.finition.create({
            data: {
                slug,
                name: finitionName,
                carModelId: finalModelId,
                price: parseFloat(price) || 0,
                year: parseInt(specs.year) || null,
                image: image || "",
                images: Array.isArray(images) ? images.filter(img => !!img) : [],
                youtubeVideo: youtubeVideo || null,
                isPromoted: isPromoted || false,
                ...processedSpecs
            },
        });

        // Handle PriceHistory if promoted
        if (isPromoted && promotionalPrice) {
            await prisma.priceHistory.create({
                data: {
                    finitionId: newFinition.id,
                    price: parseFloat(price) || 0,
                    isPromotion: true,
                    promotionalPrice: parseFloat(promotionalPrice),
                    startDate: promoStartDate ? new Date(promoStartDate) : null,
                    endDate: promoEndDate ? new Date(promoEndDate) : null,
                }
            });
        }

        revalidatePath("/");

        // Log activity
        const session = await auth();
        if (session?.user?.id) {
            await prisma.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: "CREATE_CAR",
                    details: `Created car finition: ${finitionName} (${slug})`
                }
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to create car step-by-step:", error);
        return { error: error.message || "Erreur interne lors de la création." };
    }
}

export async function updateCarStepByStep(id: string, data: any) {
    try {
        // --- SECURITY & VALIDATION ---
        const validated = CarStepSchema.safeParse(data);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        const {
            brandId, brandName,
            modelId, modelName, category, image, price, finitionName,
            year, finitionId,
            aiScore, reliability, maintCost,
            images, youtubeVideo,
            isPromoted, promotionalPrice, promoStartDate, promoEndDate,
            ...specs
        } = data;

        // --- DATABASE LOGIC ---
        const brand = await prisma.brand.findFirst({
            where: { models: { some: { finitions: { some: { id } } } } }
        });
        const model = await prisma.carModel.findFirst({
            where: { finitions: { some: { id } } }
        });

        if (!brand || !model) {
            return { error: "Véhicule non trouvé." };
        }

        const slug = generateSlug(brand.name, model.name, finitionName, year);

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

        await prisma.finition.update({
            where: { id },
            data: {
                slug,
                name: finitionName,
                price: parseFloat(price) || 0,
                year: parseInt(String(year)) || null,
                image: image || "",
                images: Array.isArray(images) ? images.filter(img => !!img) : [],
                youtubeVideo: youtubeVideo || null,
                isPromoted: isPromoted || false,
                ...processedSpecs
            },
        });

        // Handle PriceHistory if promoted
        if (isPromoted && promotionalPrice) {
            await prisma.priceHistory.create({
                data: {
                    finitionId: id,
                    price: parseFloat(price) || 0,
                    isPromotion: true,
                    promotionalPrice: parseFloat(promotionalPrice),
                    startDate: promoStartDate ? new Date(promoStartDate) : null,
                    endDate: promoEndDate ? new Date(promoEndDate) : null,
                }
            });
        }

        revalidatePath("/");
        revalidatePath("/admin/settings/cars");
        revalidatePath(`/cars/${slug}`);

        // Log activity
        const session = await auth();
        if (session?.user?.id) {
            await prisma.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: "UPDATE_CAR",
                    details: `Updated car finition: ${finitionName} (${slug})`
                }
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update car step-by-step:", error);
        return { error: error.message || "Erreur interne lors de la mise à jour." };
    }
}

// Maintenance task: generate slugs for existing records
export async function backfillSlugs() {
    try {
        // 1. Finitions
        const finitions = await prisma.finition.findMany({
            where: {
                OR: [
                    { slug: "" },
                    { year: null }
                ]
            },
            include: { carModel: { include: { brand: true } } }
        });

        for (const f of finitions) {
            const yearStr = f.year?.toString() || "0000";
            const slug = generateSlug(f.carModel.brand.name, f.carModel.name, f.name, yearStr);
            await prisma.finition.update({
                where: { id: f.id },
                data: { slug }
            });
        }

        // 2. CarModels
        const models = await prisma.carModel.findMany({
            where: {
                OR: [
                    { slug: "" },
                    { name: "" }
                ]
            },
            include: { brand: true }
        });

        for (const m of models) {
            const slug = generateSlug(m.brand.name, m.name);
            await prisma.carModel.update({
                where: { id: m.id },
                data: { slug }
            });
        }

        // 3. Brands
        const brands = await prisma.brand.findMany({
            where: { slug: "" } // Brands use non-nullable slug, so check empty string if applicable or all
        });
        // Note: Brand slug is required in schema, so they must exist. 
        // If they don't, we might need a separate strategy if prisma let them be empty.
        // For safety, let's update all brands that have slug == "" or similar.
        for (const b of brands) {
            const slug = generateSlug(b.name);
            await prisma.brand.update({
                where: { id: b.id },
                data: { slug }
            });
        }

        return { success: true, count: finitions.length + models.length + brands.length };
    } catch (error) {
        console.error("Backfill failed:", error);
        return { error: "Backfill failed" };
    }
}

export async function toggleFinitionStatus(id: string, isDead: boolean) {
    try {
        await prisma.finition.update({
            where: { id },
            data: { isDeadModel: isDead }
        });
        revalidatePath("/");
        revalidatePath("/admin/settings/cars");

        // Log activity
        const session = await auth();
        if (session?.user?.id) {
            await prisma.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: isDead ? "DEACTIVATE_CAR" : "ACTIVATE_CAR",
                    details: `Updated car status for ID: ${id}`
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to toggle finition status:", error);
        return { error: "Failed to update status" };
    }
}

export async function deleteFinition(id: string) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { error: "Non autorisé" };
        }

        const f = await prisma.finition.findUnique({
            where: { id },
            include: { carModel: { include: { brand: true } } }
        });

        await prisma.finition.delete({
            where: { id }
        });

        revalidatePath("/");
        revalidatePath("/admin/settings/cars");

        if (session?.user?.id && f) {
            await prisma.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: "DELETE_CAR",
                    details: `Deleted car finition: ${f.name} (Slug: ${f.slug})`
                }
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete car:", error);
        return { error: error.message || "Erreur lors de la suppression" };
    }
}

// ==========================================
// HERO SLIDE ACTIONS
// ==========================================

export async function getHeroSlides() {
    try {
        return await prisma.heroSlide.findMany({
            orderBy: { order: "asc" }
        });
    } catch (error) {
        console.error("Failed to fetch hero slides:", error);
        return [];
    }
}

export async function getActiveHeroSlides() {
    try {
        return await prisma.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        console.error("Failed to fetch active hero slides:", error);
        return [];
    }
}

export async function createHeroSlide(data: {
    title: string;
    subtitle: string;
    description: string;
    price: string;
    image: string;
    brandLogo: string;
    order: number;
    isActive: boolean;
}) {
    try {
        await prisma.heroSlide.create({ data });
        revalidatePath("/");
        revalidatePath("/admin/settings/hero");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create hero slide:", error);
        return { error: error.message || "Erreur lors de la création du slide" };
    }
}

export async function updateHeroSlide(id: string, data: any) {
    try {
        await prisma.heroSlide.update({
            where: { id },
            data
        });
        revalidatePath("/");
        revalidatePath("/admin/settings/hero");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update hero slide:", error);
        return { error: error.message || "Erreur lors de la mise à jour du slide" };
    }
}

export async function deleteHeroSlide(id: string) {
    try {
        await prisma.heroSlide.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/settings/hero");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete hero slide:", error);
        return { error: error.message || "Erreur lors de la suppression du slide" };
    }
}

// ==========================================
// PROMOTIONS & PRICE HISTORY ACTIONS
// ==========================================

export async function toggleFinitionPromotion(id: string, isPromoted: boolean) {
    try {
        await prisma.finition.update({
            where: { id },
            data: { isPromoted: isPromoted }
        });
        revalidatePath("/");
        revalidatePath("/admin/settings/cars");

        // Log activity
        const session = await auth();
        if (session?.user?.id) {
            await prisma.activityLog.create({
                data: {
                    userId: session.user.id,
                    action: isPromoted ? "ENABLE_PROMOTION" : "DISABLE_PROMOTION",
                    details: `Updated promotion status for Finition ID: ${id}`
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to toggle finition promotion status:", error);
        return { error: "Failed to update promotion status" };
    }
}
