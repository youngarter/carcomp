"use server";

import { prisma } from "@/lib/db";
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
    // Auth guard – admins only
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

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
                        startPrice: price,
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
                finitionPriceHistory: {
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
                finitionPriceHistory: {
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

import { cache } from 'react';

export const getFinitionDetails = cache(async (brandSlug: string, modelSlug: string, finitionSlug: string) => {
    try {
        // Find brand first
        const brand = await prisma.brand.findUnique({
            where: { slug: brandSlug },
        });

        if (!brand) return null;

        // Find model
        const model = await prisma.carModel.findFirst({
            where: {
                brandId: brand.id,
                OR: [
                    { slug: modelSlug },
                    { slug: `${brandSlug}-${modelSlug}` }
                ]
            },
        });

        if (!model) return null;

        // Find finition
        // We try different slug patterns just in case
        const finition = await prisma.finition.findFirst({
            where: {
                carModelId: model.id,
                OR: [
                    { slug: finitionSlug },
                    { slug: finitionSlug.replace(/ /g, "-") },
                    { slug: finitionSlug.replace(/%20/g, "-") },
                    { slug: { contains: finitionSlug } }
                ]
            },
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
                finitionPriceHistory: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        return finition;
    } catch (error) {
        console.error("Failed to fetch finition details:", error);
        return null;
    }
});

export async function getSimilarCars(category: string, currentId?: string, limit: number = 4) {
    try {
        const results = await prisma.finition.findMany({
            where: {
                carModel: { category },
                id: currentId ? { not: currentId } : undefined,
                isDeadModel: false,
            },
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
            },
            take: limit,
        });

        // Ensure compatibility with VehicleCard types if necessary
        // VehicleCard expects 'price', but our schema has 'startPrice'
        return results.map(f => ({
            ...f,
            price: f.startPrice, // Mapping startPrice to price for VehicleCard
        }));
    } catch (error) {
        console.error("Failed to fetch similar cars:", error);
        return [];
    }
}

export async function getReviewsForModel(carModelId: string) {
    try {
        return await prisma.review.findMany({
            where: {
                carModelId,
                status: "APPROVED",
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
}

export async function submitReview(formData: FormData) {
    try {
        const carModelId = formData.get("carModelId") as string;
        const rating = parseInt(formData.get("rating") as string);
        const userName = formData.get("userName") as string;
        const comment = formData.get("comment") as string;

        if (!carModelId || !rating || !comment) {
            return { error: "Missing required fields" };
        }

        await prisma.review.create({
            data: {
                carModelId,
                rating,
                userName,
                comment,
                status: "PENDING",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to submit review:", error);
        return { error: "Failed to submit review" };
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
    // Auth guard – admins only
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

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
                startPrice: parseFloat(price) || 0,
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
            await prisma.finitionPriceHistory.create({
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
            try {
                // Verify user exists before logging (optional but safer)
                const userExists = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true }
                });

                if (userExists) {
                    await prisma.activityLog.create({
                        data: {
                            userId: session.user.id,
                            action: "CREATE_CAR",
                            details: `Created car finition: ${finitionName} (${slug})`
                        }
                    });
                } else {
                    console.warn(`ActivityLog skipped: User ID ${session.user.id} not found in database.`);
                }
            } catch (logError) {
                console.error("Failed to log activity:", logError);
                // Do not throw, allow the main operation to succeed
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to create car step-by-step:", error);
        return { error: error.message || "Erreur interne lors de la création." };
    }
}

export async function updateCarStepByStep(id: string, data: any) {
    // Auth guard – admins only
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

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
                startPrice: parseFloat(price) || 0,
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
            await prisma.finitionPriceHistory.create({
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
        revalidatePath("/admin/cars");
        revalidatePath(`/car/${slug}`);

        // Log activity
        const session = await auth();
        if (session?.user?.id) {
            try {
                // Verify user exists before logging
                const userExists = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true }
                });

                if (userExists) {
                    await prisma.activityLog.create({
                        data: {
                            userId: session.user.id,
                            action: "UPDATE_CAR",
                            details: `Updated car finition: ${finitionName} (${slug})`
                        }
                    });
                } else {
                    console.warn(`ActivityLog skipped: User ID ${session.user.id} not found in database.`);
                }
            } catch (logError) {
                console.error("Failed to log activity:", logError);
                // Do not throw, allow the main operation to succeed
            }
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
        revalidatePath("/admin/cars");

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
        revalidatePath("/admin/cars");

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

const HeroSlideSchema = z.object({
    title: z.string().min(1, "Le titre est obligatoire"),
    subtitle: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    price: z.string().optional().nullable(),
    url: z.string().url("URL de redirection invalide").optional().or(z.literal("")).nullable(),
    image: z.string().url("L'URL de l'image est invalide").min(1, "L'image est obligatoire"),
    imageAlt: z.string().optional().nullable(),
    brandLogo: z.string().url("URL du logo invalide").optional().or(z.literal("")).nullable(),
    order: z.coerce.number().default(0),
    isActive: z.boolean().default(true),
});

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

export async function createHeroSlide(data: any) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { error: "Non autorisé" };
        }

        const validated = HeroSlideSchema.safeParse(data);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        // Convert optional string fields handling
        const cleanData = {
            ...validated.data,
            subtitle: validated.data.subtitle || "",
            description: validated.data.description || "",
            price: validated.data.price || "",
            url: validated.data.url || "",
            imageAlt: validated.data.imageAlt || "",
            brandLogo: validated.data.brandLogo || "",
        };

        await prisma.heroSlide.create({ data: cleanData });
        revalidatePath("/");
        revalidatePath("/admin/hero");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create hero slide:", error);
        return { error: error.message || "Erreur lors de la création du slide" };
    }
}

export async function updateHeroSlide(id: string, data: any) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { error: "Non autorisé" };
        }

        const validated = HeroSlideSchema.partial().safeParse(data);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        const cleanData: any = {};
        for (const [key, value] of Object.entries(validated.data)) {
            cleanData[key] = value === null ? "" : value;
        }

        await prisma.heroSlide.update({
            where: { id },
            data: cleanData
        });
        revalidatePath("/");
        revalidatePath("/admin/hero");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update hero slide:", error);
        return { error: error.message || "Erreur lors de la mise à jour du slide" };
    }
}

export async function deleteHeroSlide(id: string) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { error: "Non autorisé" };
        }

        await prisma.heroSlide.delete({ where: { id } });
        revalidatePath("/");
        revalidatePath("/admin/hero");
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
        revalidatePath("/admin/cars");

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

export async function getPromotedCars() {
    try {
        const finitions = await prisma.finition.findMany({
            take: 8,
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
                finitionPriceHistory: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                }
            },
            orderBy: [
                { isPromoted: "desc" },
                { carModel: { aiScore: "desc" } },
                { createdAt: "desc" }
            ],
            where: {
                isDeadModel: false
            }
        });

        return finitions.map((f: any) => ({
            id: f.id,
            slug: f.slug,
            name: f.name,
            price: f.startPrice,
            isPromoted: f.isPromoted,
            promotionalPrice: f.finitionPriceHistory?.[0]?.promotionalPrice || null,
            promoStartDate: f.finitionPriceHistory?.[0]?.startDate ? f.finitionPriceHistory[0].startDate.toISOString() : null,
            promoEndDate: f.finitionPriceHistory?.[0]?.endDate ? f.finitionPriceHistory[0].endDate.toISOString() : null,
            images: f.images || [],
            image: f.image,
            model: {
                name: f.carModel.name,
                brand: {
                    name: f.carModel.brand.name,
                    logo: f.carModel.brand.logo
                },
                category: f.carModel.category,
                imageUrl: f.carModel.image,
                aiScore: f.carModel.aiScore,
                reliability: f.carModel.reliability,
                maintCost: f.carModel.maintCost,
            },
            specs: {
                moteur: {
                    energie: f.energy,
                    motorisation: f.motorisation,
                    puissanceDynamique: f.power ? `${f.power}ch` : null,
                    transmission: f.transmission,
                    boiteAVitesse: f.gearbox,
                    emplacement: f.emplacement,
                    fiscalPower: f.fiscalPower,
                    cylindree: f.cylindree,
                    coupleMax: f.coupleMax,
                    palettesVolant: f.palettesVolant === "Oui",
                    powerThermique: f.powerThermique,
                    powerElec: f.powerElec,
                    batteryCapacity: f.batteryCapacity
                },
                consoPerformances: {
                    consoMixte: f.consoMixed?.toString(),
                    co2Emission: f.co2Emission?.toString(),
                    vitesseMax: f.maxSpeed ? `${f.maxSpeed} km/h` : null,
                    acceleration: f.acceleration ? `${f.acceleration}s` : null,
                    consoCity: f.consoCity,
                    consoRoad: f.consoRoad
                },
                dimensions: {
                    places: f.seats,
                    volumeCoffre: f.trunkVolume,
                    volumeReservoir: f.tankVolume,
                    poids: f.weight,
                    longueur: f.length,
                    largeur: f.width,
                    hauteur: f.height,
                    empattement: f.wheelbase
                },
                securite: {
                    airbags: f.airbags,
                    abs: f.abs,
                    esp: f.esp,
                    isofix: f.isofix,
                    antipatinage: f.antipatinage,
                    aideFreinageUrgence: f.aideFreinageUrgence,
                    antidemarrage: f.antidemarrage,
                    aideDemarrageCote: f.aideDemarrageCote,
                    modeConduite: f.modeConduite,
                    detecteurFatigue: f.detecteurFatigue,
                    maintienVoie: f.maintienVoie,
                    detecteurAngleMort: f.detecteurAngleMort,
                    detecteurSousGonflage: f.detecteurSousGonflage,
                    fermetureAuto: f.fermetureAuto,
                    pharesAntibrouillard: f.pharesAntibrouillard,
                    alarme: f.alarme
                },
                confort: {
                    climatisation: f.climatisation,
                    systemeAudio: f.systemeAudio,
                    ordinateurBord: f.ordinateurBord,
                    startStop: f.startStop,
                    regulateurVitesse: f.regulateurVitesse,
                    detecteurPluie: f.detecteurPluie,
                    allumageAutoFeux: f.allumageAutoFeux,
                    freinMainElectrique: f.freinMainElectrique,
                    ecranTactile: f.ecranTactile,
                    cockpitDigital: f.cockpitDigital,
                    reconnaissancePanneaux: f.reconnaissancePanneaux,
                    affichageTeteHaute: f.affichageTeteHaute,
                    cameraRecul: f.cameraRecul,
                    radarStationnement: f.radarStationnement === "Avant et Arrière" || f.radarStationnement === "360°",
                    parkAssist: f.parkAssist,
                    commandesVolant: f.commandesVolant,
                    commandesVocales: f.commandesVocales,
                    volantReglable: f.volantReglable !== "Aucun",
                    vitresElectriques: f.vitresElectriques !== "Aucune",
                    retrosElectriques: f.retrosElectriques,
                    retrosRabattables: f.retrosRabattables,
                    coffreElectrique: f.coffreElectrique,
                    mainsLibres: f.mainsLibres,
                    siegesElectriques: f.siegesElectriques,
                    siegesMemoire: f.siegesMemoire,
                    banquetteRabattable: f.banquetteRabattable !== "Non",
                    navigationGps: f.navigationGps,
                    wifi: f.wifi,
                    bluetooth: f.bluetooth,
                    appleCarplay: f.appleCarplay,
                    chargeurSansFil: f.chargeurSansFil
                },
                esthetique: {
                    jantesAlu: f.jantesAlu !== "Aucune",
                    sellerie: f.sellerie,
                    volantCuir: f.volantCuir,
                    followMeHome: f.followMeHome,
                    lumiereAmbiance: f.lumiereAmbiance,
                    feuxJour: f.feuxJour !== "Aucun",
                    phares: f.phares,
                    toit: f.toit,
                    barresToit: f.barresToit,
                    vitresSurteintees: f.vitresSurteintees
                }
            }
        }));
    } catch (error) {
        console.error("Failed to fetch promoted cars:", error);
        return [];
    }
}

export async function getFilteredCars(filters: any, skip: number = 0, take: number = 12) {
    try {
        const {
            brand, category, priceMin, priceMax, energy, transmission, seats, aiScoreMin, sort
        } = filters;

        const where: any = {
            isDeadModel: false,
        };

        if (brand && brand !== "all") {
            where.carModel = { ...where.carModel, brand: { slug: brand } };
        }
        if (category && category !== "all") {
            where.carModel = { ...where.carModel, category: category };
        }
        if (priceMin || priceMax) {
            where.startPrice = {
                ...(priceMin && { gte: parseFloat(priceMin) }),
                ...(priceMax && { lte: parseFloat(priceMax) }),
            };
        }
        if (energy && energy !== "all") {
            where.energy = energy;
        }
        if (transmission && transmission !== "all") {
            where.transmission = transmission;
        }
        if (seats && seats !== "all") {
            where.seats = parseInt(seats);
        }
        if (aiScoreMin) {
            where.carModel = { ...where.carModel, aiScore: { gte: parseFloat(aiScoreMin) } };
        }

        let orderBy: any = { createdAt: "desc" };
        if (sort) {
            switch (sort) {
                case "price_asc": orderBy = { startPrice: "asc" }; break;
                case "price_desc": orderBy = { startPrice: "desc" }; break;
                case "ai_score": orderBy = { carModel: { aiScore: "desc" } }; break;
                case "newest": orderBy = { createdAt: "desc" }; break;
                case "promotions": orderBy = { isPromoted: "desc" }; break;
            }
        }

        const finitions = await prisma.finition.findMany({
            where,
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
                finitionPriceHistory: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                }
            },
            orderBy,
            skip,
            take
        });

        return finitions.map((f: any) => ({
            id: f.id,
            slug: f.slug,
            name: f.name,
            price: f.startPrice,
            isPromoted: f.isPromoted,
            promotionalPrice: f.finitionPriceHistory?.[0]?.promotionalPrice || null,
            promoStartDate: f.finitionPriceHistory?.[0]?.startDate ? f.finitionPriceHistory[0].startDate.toISOString() : null,
            promoEndDate: f.finitionPriceHistory?.[0]?.endDate ? f.finitionPriceHistory[0].endDate.toISOString() : null,
            images: f.images || [],
            image: f.image,
            model: {
                name: f.carModel.name,
                brand: {
                    name: f.carModel.brand.name,
                    logo: f.carModel.brand.logo
                },
                category: f.carModel.category,
                imageUrl: f.carModel.image,
                aiScore: f.carModel.aiScore,
                reliability: f.carModel.reliability,
                maintCost: f.carModel.maintCost,
            },
            specs: {
                moteur: {
                    energie: f.energy,
                    motorisation: f.motorisation,
                    puissanceDynamique: f.power ? `${f.power}ch` : null,
                    transmission: f.transmission,
                    boiteAVitesse: f.gearbox,
                    emplacement: f.emplacement,
                    fiscalPower: f.fiscalPower,
                    cylindree: f.cylindree,
                    coupleMax: f.coupleMax,
                    palettesVolant: f.palettesVolant === "Oui",
                    powerThermique: f.powerThermique,
                    powerElec: f.powerElec,
                    batteryCapacity: f.batteryCapacity
                },
                consoPerformances: {
                    consoMixte: f.consoMixed?.toString(),
                    co2Emission: f.co2Emission?.toString(),
                    vitesseMax: f.maxSpeed ? `${f.maxSpeed} km/h` : null,
                    acceleration: f.acceleration ? `${f.acceleration}s` : null,
                    consoCity: f.consoCity,
                    consoRoad: f.consoRoad
                },
                dimensions: {
                    places: f.seats,
                    volumeCoffre: f.trunkVolume,
                    volumeReservoir: f.tankVolume,
                    poids: f.weight,
                    longueur: f.length,
                    largeur: f.width,
                    hauteur: f.height,
                    empattement: f.wheelbase
                },
                securite: {
                    airbags: f.airbags,
                    abs: f.abs,
                    esp: f.esp,
                    isofix: f.isofix,
                    antipatinage: f.antipatinage,
                    aideFreinageUrgence: f.aideFreinageUrgence,
                    antidemarrage: f.antidemarrage,
                    aideDemarrageCote: f.aideDemarrageCote,
                    modeConduite: f.modeConduite,
                    detecteurFatigue: f.detecteurFatigue,
                    maintienVoie: f.maintienVoie,
                    detecteurAngleMort: f.detecteurAngleMort,
                    detecteurSousGonflage: f.detecteurSousGonflage,
                    fermetureAuto: f.fermetureAuto,
                    pharesAntibrouillard: f.pharesAntibrouillard,
                    alarme: f.alarme
                },
                confort: {
                    climatisation: f.climatisation,
                    systemeAudio: f.systemeAudio,
                    ordinateurBord: f.ordinateurBord,
                    startStop: f.startStop,
                    regulateurVitesse: f.regulateurVitesse,
                    detecteurPluie: f.detecteurPluie,
                    allumageAutoFeux: f.allumageAutoFeux,
                    freinMainElectrique: f.freinMainElectrique,
                    ecranTactile: f.ecranTactile,
                    cockpitDigital: f.cockpitDigital,
                    reconnaissancePanneaux: f.reconnaissancePanneaux,
                    affichageTeteHaute: f.affichageTeteHaute,
                    cameraRecul: f.cameraRecul,
                    radarStationnement: f.radarStationnement === "Avant et Arrière" || f.radarStationnement === "360°",
                    parkAssist: f.parkAssist,
                    commandesVolant: f.commandesVolant,
                    commandesVocales: f.commandesVocales,
                    volantReglable: f.volantReglable !== "Aucun",
                    vitresElectriques: f.vitresElectriques !== "Aucune",
                    retrosElectriques: f.retrosElectriques,
                    retrosRabattables: f.retrosRabattables,
                    coffreElectrique: f.coffreElectrique,
                    mainsLibres: f.mainsLibres,
                    siegesElectriques: f.siegesElectriques,
                    siegesMemoire: f.siegesMemoire,
                    banquetteRabattable: f.banquetteRabattable !== "Non",
                    navigationGps: f.navigationGps,
                    wifi: f.wifi,
                    bluetooth: f.bluetooth,
                    appleCarplay: f.appleCarplay,
                    chargeurSansFil: f.chargeurSansFil
                }
            }
        }));
    } catch (error) {
        console.error("Failed to fetch filtered cars:", error);
        return [];
    }
}
