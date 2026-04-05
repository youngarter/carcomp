"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { cache } from 'react';
import { z } from "zod";
import { generateSlug } from "./utils.actions";
import { FinitionComplete, FinitionCard, finitionCardSelect } from "@/types/car.types";
import { SAFETY_LABELS, COMFORT_LABELS, AESTHETIC_LABELS } from "../constants/features";
// ==========================================
// SCHEMAS
// ==========================================

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

// ==========================================
// CAR CRUD ACTIONS
// ==========================================

export async function createCar(formData: FormData) {
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
        const brandSlug = generateSlug(brandName);
        const brand = await prisma.brand.upsert({
            where: { name: brandName },
            update: {},
            create: { name: brandName, slug: brandSlug },
        });

        const modelSlug = generateSlug(brandName, modelName);
        await prisma.carModel.create({
            data: {
                name: modelName,
                slug: modelSlug,
                brandId: brand.id,
                category: category as any,
                image,
                aiScore,
                reliability,
                maintCost,
                finitions: {
                    create: {
                        slug,
                        name: finitionName,
                        basePrice: price,
                        images: [finitionImage],
                        technicalSpecs: {
                            create: {
                                fuelType: (energy || "ESSENCE") as any,
                                transmission: (transmission || "MANUELLE") as any,
                                dinPower: power,
                                acceleration,
                                topSpeed: maxSpeed,
                                consoMixed,
                                co2Emission,
                            }
                        }
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

export async function createCarStepByStep(data: any) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

    try {
        const validated = CarStepSchema.safeParse(data);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        const {
            brandId, brandName,
            modelId, modelName, category, image, price, finitionName,
            year: dataYear, phaseType: formPhaseType, finitionId,
            aiScore, reliability, maintCost,
            images, youtubeVideo,
            isPromoted, promotionalPrice, promoStartDate, promoEndDate,
            ...specs
        } = data;

        let finalBrandName = brandName;
        let finalBrandId = brandId;

        if (brandId && !brandName) {
            const b = await prisma.brand.findUnique({ where: { id: brandId } });
            finalBrandName = b?.name || "Unknown";
        }

        if (!finalBrandId && brandName) {
            const brandSlug = generateSlug(brandName);
            const brand = await prisma.brand.upsert({
                where: { slug: brandSlug },
                update: {},
                create: { name: brandName, slug: brandSlug },
            });
            finalBrandId = brand.id;
            finalBrandName = brand.name;
        }

        if (!finalBrandId) {
            return { error: "La marque est obligatoire." };
        }

        let finalModelName = modelName;
        let finalModelId = modelId;

        if (modelId && !modelName) {
            const m = await prisma.carModel.findUnique({ where: { id: modelId } });
            finalModelName = m?.name || "Unknown";
        }

        if (!finalModelId && modelName) {
            const modelSlug = generateSlug(finalBrandName, modelName);
            let model = await prisma.carModel.findUnique({ where: { slug: modelSlug } });
            if (!model) {
                model = await prisma.carModel.create({
                    data: {
                        name: modelName,
                        slug: modelSlug,
                        brandId: finalBrandId,
                        category: (category || "SUV") as any,
                        image: image || "",
                        aiScore: parseFloat(aiScore) || 8.0,
                        reliability: parseFloat(reliability) || 8.0,
                        maintCost: parseFloat(maintCost) || 0,
                    },
                });
            }
            finalModelId = model.id;
        }

        if (!finalModelId) {
            return { error: "Le modèle est obligatoire." };
        }

        const year = dataYear;
        const slug = generateSlug(finalBrandName, finalModelName, finitionName, year.toString());

        const phaseType = formPhaseType || "new";
        const generationYear = parseInt(year) || new Date().getFullYear();
        const genSlug = generateSlug(finalBrandName, finalModelName, phaseType, generationYear.toString());

        let generation = await prisma.carGeneration.findUnique({ where: { slug: genSlug } });
        if (!generation) {
            generation = await prisma.carGeneration.create({
                data: {
                    slug: genSlug,
                    name: `${finalModelName} ${phaseType === 'new' ? 'Nouvelle Génération' : phaseType === 'facelift' ? '(Facelift)' : ''} ${generationYear}`,
                    carModelId: finalModelId,
                    startYear: generationYear,
                    phaseType: phaseType,
                    isCurrent: true,
                }
            });
            await prisma.carGeneration.updateMany({
                where: { carModelId: finalModelId, id: { not: generation.id } },
                data: { isCurrent: false }
            });
        }

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
                generationId: generation.id,
                basePrice: parseFloat(price) || 0,
                year: parseInt(String(year)) || null,
                images: Array.isArray(images) ? images.filter(img => !!img) : [],
                youtubeVideo: youtubeVideo || null,
                isPromoted: isPromoted || false,
                // On sépare les specs techniques du reste
                technicalSpecs: {
                    create: {
                        fuelType: (specs.fuelType || specs.energy || "ESSENCE") as any,
                        transmission: (specs.transmission || "MANUELLE") as any,
                        dinPower: processedSpecs.power || processedSpecs.dinPower || null,
                        fiscalPower: processedSpecs.fiscalPower || null,
                        engineDisplacement: processedSpecs.cylindree || processedSpecs.engineDisplacement || null,
                        acceleration: processedSpecs.acceleration || null,
                        topSpeed: processedSpecs.maxSpeed || processedSpecs.topSpeed || null,
                        consoMixed: processedSpecs.consoMixed || null,
                        co2Emission: processedSpecs.co2Emission || null,
                        seats: processedSpecs.seats || 5,
                        weight: processedSpecs.weight || null,
                        length: processedSpecs.length || null,
                        width: processedSpecs.width || null,
                        height: processedSpecs.height || null,
                        wheelbase: processedSpecs.wheelbase || null,
                        trunkVolume: processedSpecs.trunkVolume || null,
                        tankVolume: processedSpecs.tankVolume || null,
                    }
                },
                safetyFeatures: Object.keys(SAFETY_LABELS).reduce((acc: any, key) => {
                    if (processedSpecs[key] !== undefined && processedSpecs[key] !== null && processedSpecs[key] !== "") acc[key] = processedSpecs[key];
                    return acc;
                }, { airbags: processedSpecs.airbags || 0 }),
                comfortFeatures: Object.keys(COMFORT_LABELS).reduce((acc: any, key) => {
                    if (processedSpecs[key] !== undefined && processedSpecs[key] !== null && processedSpecs[key] !== "") acc[key] = processedSpecs[key];
                    return acc;
                }, { airConditioning: processedSpecs.airConditioning || processedSpecs.climatisation || "Aucune" }),
                aestheticFeatures: Object.keys(AESTHETIC_LABELS).reduce((acc: any, key) => {
                    if (processedSpecs[key] !== undefined && processedSpecs[key] !== null && processedSpecs[key] !== "") acc[key] = processedSpecs[key];
                    return acc;
                }, {}),
            },
        });

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

        if (session?.user?.id) {
            try {
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
                }
            } catch (logError) {
                console.error("Failed to log activity:", logError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to create car step-by-step:", error);
        return { error: error.message || "Erreur interne lors de la création." };
    }
}

export async function updateCarStepByStep(id: string, data: any) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

    try {
        const validated = CarStepSchema.safeParse(data);
        if (!validated.success) {
            return { error: validated.error.issues[0].message };
        }

        const {
            brandId, brandName,
            modelId, modelName, category, image, price, finitionName,
            year: dataYear, phaseType: formPhaseType, finitionId,
            aiScore, reliability, maintCost,
            images, youtubeVideo,
            isPromoted, promotionalPrice, promoStartDate, promoEndDate,
            ...specs
        } = data;

        const brand = await prisma.brand.findFirst({
            where: { models: { some: { finitions: { some: { id } } } } }
        });
        const model = await prisma.carModel.findFirst({
            where: { finitions: { some: { id } } }
        });

        if (!brand || !model) {
            return { error: "Véhicule non trouvé." };
        }

        const year = dataYear;
        const slug = generateSlug(brand.name, model.name, finitionName, year.toString());

        const phaseType = formPhaseType || "new";
        const generationYear = parseInt(String(year)) || new Date().getFullYear();
        const genSlug = generateSlug(brand.name, model.name, phaseType, generationYear.toString());

        let generation = await prisma.carGeneration.findUnique({ where: { slug: genSlug } });
        if (!generation) {
            generation = await prisma.carGeneration.create({
                data: {
                    slug: genSlug,
                    name: `${model.name} ${phaseType === 'new' ? 'Nouvelle Génération' : phaseType === 'facelift' ? '(Facelift)' : ''} ${generationYear}`,
                    carModelId: model.id,
                    startYear: generationYear,
                    phaseType: phaseType,
                    isCurrent: true,
                }
            });
            await prisma.carGeneration.updateMany({
                where: { carModelId: model.id, id: { not: generation.id } },
                data: { isCurrent: false }
            });
        }

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
                generationId: generation.id,
                basePrice: parseFloat(price) || 0,
                year: parseInt(String(year)) || null,
                images: Array.isArray(images) ? images.filter(img => !!img) : [],
                youtubeVideo: youtubeVideo || null,
                isPromoted: isPromoted || false,
                // Mise à jour des specs techniques
                technicalSpecs: {
                    upsert: {
                        create: {
                            fuelType: (specs.fuelType || specs.energy || "ESSENCE") as any,
                            transmission: (specs.transmission || "MANUELLE") as any,
                            dinPower: processedSpecs.power || processedSpecs.dinPower || null,
                            fiscalPower: processedSpecs.fiscalPower || null,
                            engineDisplacement: processedSpecs.cylindree || processedSpecs.engineDisplacement || null,
                            acceleration: processedSpecs.acceleration || null,
                            topSpeed: processedSpecs.maxSpeed || processedSpecs.topSpeed || null,
                            consoMixed: processedSpecs.consoMixed || null,
                            co2Emission: processedSpecs.co2Emission || null,
                            seats: processedSpecs.seats || 5,
                            weight: processedSpecs.weight || null,
                            length: processedSpecs.length || null,
                            width: processedSpecs.width || null,
                            height: processedSpecs.height || null,
                            wheelbase: processedSpecs.wheelbase || null,
                            trunkVolume: processedSpecs.trunkVolume || null,
                            tankVolume: processedSpecs.tankVolume || null,
                        },
                        update: {
                            fuelType: (specs.fuelType || specs.energy || "ESSENCE") as any,
                            transmission: (specs.transmission || "MANUELLE") as any,
                            dinPower: processedSpecs.power || processedSpecs.dinPower || null,
                            fiscalPower: processedSpecs.fiscalPower || null,
                            engineDisplacement: processedSpecs.cylindree || processedSpecs.engineDisplacement || null,
                            acceleration: processedSpecs.acceleration || null,
                            topSpeed: processedSpecs.maxSpeed || processedSpecs.topSpeed || null,
                            consoMixed: processedSpecs.consoMixed || null,
                            co2Emission: processedSpecs.co2Emission || null,
                            seats: processedSpecs.seats || 5,
                            weight: processedSpecs.weight || null,
                            length: processedSpecs.length || null,
                            width: processedSpecs.width || null,
                            height: processedSpecs.height || null,
                            wheelbase: processedSpecs.wheelbase || null,
                            trunkVolume: processedSpecs.trunkVolume || null,
                            tankVolume: processedSpecs.tankVolume || null,
                        }
                    }
                },
                // Mise à jour des équipements JSON
                safetyFeatures: {
                    abs: !!processedSpecs.abs,
                    esp: !!processedSpecs.esp,
                    tractionControl: !!processedSpecs.antipatinage,
                    emergencyBraking: !!processedSpecs.aideFreinageUrgence || !!processedSpecs.emergencyBraking,
                    immobilizer: !!processedSpecs.antidemarrage,
                    hillStartAssist: !!processedSpecs.aideDemarrageCote,
                    fatigueDetection: !!processedSpecs.detecteurFatigue || !!processedSpecs.fatigueDetection,
                    laneAssist: !!processedSpecs.maintienVoie || !!processedSpecs.laneAssist,
                    blindSpotMonitor: !!processedSpecs.detecteurAngleMort || !!processedSpecs.blindSpotMonitor,
                    tirePressureMonitor: !!processedSpecs.detecteurSousGonflage || !!processedSpecs.tirePressureMonitor,
                    autoDoorLock: !!processedSpecs.fermetureAuto,
                    isofix: !!processedSpecs.isofix,
                    fogLights: !!processedSpecs.pharesAntibrouillard,
                    alarm: !!processedSpecs.alarme,
                    airbags: processedSpecs.airbags || 0,
                    trafficSignRecognition: !!processedSpecs.reconnaissancePanneaux,
                },
                comfortFeatures: {
                    airConditioning: processedSpecs.climatisation || processedSpecs.airConditioning || "Aucune",
                    audioSystem: processedSpecs.systemeAudio || null,
                    onBoardComputer: !!processedSpecs.ordinateurBord,
                    startStop: !!processedSpecs.startStop,
                    cruiseControl: processedSpecs.regulateurVitesse || processedSpecs.cruiseControl || null,
                    rainSensor: !!processedSpecs.detecteurPluie,
                    autoHeadlights: !!processedSpecs.allumageAutoFeux,
                    electricParkingBrake: !!processedSpecs.freinMainElectrique,
                    touchScreen: !!processedSpecs.ecranTactile,
                    digitalCockpit: !!processedSpecs.cockpitDigital || !!processedSpecs.digitalCockpit,
                    headUpDisplay: !!processedSpecs.affichageTeteHaute,
                    rearCamera: !!processedSpecs.cameraRecul || !!processedSpecs.rearCamera,
                    parkingSensors: processedSpecs.radarStationnement || processedSpecs.parkingSensors || null,
                    parkAssist: !!processedSpecs.parkAssist,
                    steeringWheelControls: !!processedSpecs.commandesVolant,
                    voiceCommands: !!processedSpecs.commandesVocales,
                    adjustableSteeringWheel: processedSpecs.volantReglable || null,
                    electricWindows: processedSpecs.vitresElectriques || null,
                    electricMirrors: !!processedSpecs.retrosElectriques,
                    foldingMirrors: !!processedSpecs.retrosRabattables,
                    electricTrunk: !!processedSpecs.coffreElectrique,
                    keylessEntry: !!processedSpecs.mainsLibres || !!processedSpecs.keylessEntry,
                    electricSeats: !!processedSpecs.siegesElectriques || !!processedSpecs.electricSeats,
                    memorySeats: !!processedSpecs.siegesMemoire,
                    foldingRearSeats: processedSpecs.banquetteRabattable || null,
                    navigationGps: !!processedSpecs.navigationGps || !!processedSpecs.navigation,
                    wifi: !!processedSpecs.wifi,
                    bluetooth: !!processedSpecs.bluetooth,
                    appleCarplay: !!processedSpecs.appleCarplay,
                    androidAuto: !!processedSpecs.androidAuto,
                    wirelessCharging: !!processedSpecs.chargeurSansFil,
                    steeringPaddles: !!processedSpecs.palettesVolant,
                },
                aestheticFeatures: {
                    alloyWheels: processedSpecs.jantesAlu || processedSpecs.alloyWheels || null,
                    upholstery: processedSpecs.sellerie || null,
                    leatherSteeringWheel: !!processedSpecs.volantCuir || !!processedSpecs.leatherSteeringWheel,
                    followMeHome: !!processedSpecs.followMeHome,
                    ambientLighting: !!processedSpecs.lumiereAmbiance || !!processedSpecs.ambientLighting,
                    daytimeRunningLights: processedSpecs.feuxJour || null,
                    headlights: processedSpecs.phares || null,
                    roof: processedSpecs.toit || null,
                    roofRails: !!processedSpecs.barresToit || !!processedSpecs.roofRails,
                    tintedWindows: !!processedSpecs.vitresSurteintees || !!processedSpecs.tintedWindows,
                },
            },
        });

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

        if (session?.user?.id) {
            try {
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
                }
            } catch (logError) {
                console.error("Failed to log activity:", logError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to update car step-by-step:", error);
        return { error: error.message || "Erreur interne lors de la mise à jour." };
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
            try {
                const userExists = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true }
                });
                if (userExists) {
                    await prisma.activityLog.create({
                        data: {
                            userId: session.user.id,
                            action: "DELETE_CAR",
                            details: `Deleted car finition: ${f.name} (Slug: ${f.slug})`
                        }
                    });
                }
            } catch (logError) {
                console.error("Failed to log activity during delete:", logError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete car:", error);
        return { error: error.message || "Erreur lors de la suppression" };
    }
}

export async function toggleFinitionStatus(id: string, isDead: boolean) {
    try {
        await prisma.finition.update({
            where: { id },
            data: { isDiscontinued: isDead }
        });
        revalidatePath("/");
        revalidatePath("/admin/cars");

        const session = await auth();
        if (session?.user?.id) {
            try {
                const userExists = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true }
                });
                if (userExists) {
                    await prisma.activityLog.create({
                        data: {
                            userId: session.user.id,
                            action: isDead ? "DEACTIVATE_CAR" : "ACTIVATE_CAR",
                            details: `Updated car status for ID: ${id}`
                        }
                    });
                }
            } catch (logError) {
                console.error("Failed to log activity:", logError);
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to toggle finition status:", error);
        return { error: "Failed to update status" };
    }
}

export async function toggleFinitionPromotion(id: string, isPromoted: boolean) {
    try {
        await prisma.finition.update({
            where: { id },
            data: { isPromoted: isPromoted }
        });
        revalidatePath("/");
        revalidatePath("/admin/cars");

        const session = await auth();
        if (session?.user?.id) {
            try {
                const userExists = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { id: true }
                });
                if (userExists) {
                    await prisma.activityLog.create({
                        data: {
                            userId: session.user.id,
                            action: isPromoted ? "ENABLE_PROMOTION" : "DISABLE_PROMOTION",
                            details: `Updated promotion status for Finition ID: ${id}`
                        }
                    });
                }
            } catch (logError) {
                console.error("Failed to log activity:", logError);
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to toggle finition promotion status:", error);
        return { error: "Failed to update promotion status" };
    }
}

// ==========================================
// FETCHING ACTIONS
// ==========================================

export async function getFinitionCatalog() {
    try {
        return await prisma.finition.findMany({
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
                technicalSpecs: true,
                generation: true,
                priceHistory: {
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
                technicalSpecs: true,
                generation: true,
                priceHistory: {
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

export const getFinitionDetails = cache(async (brandSlug: string, modelSlug: string, finitionSlug: string): Promise<FinitionComplete | null> => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { slug: brandSlug },
        });

        if (!brand) return null;

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
                technicalSpecs: true,
                generation: true,
                priceHistory: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        if (!finition) return null;
        return finition as unknown as FinitionComplete;
    } catch (error) {
        console.error("Failed to fetch finition details:", error);
        return null;
    }
});

export async function getSimilarCars(category: string, currentId?: string, limit: number = 4): Promise<FinitionCard[]> {
    try {
        const results = await prisma.finition.findMany({
            where: {
                carModel: { category: category as any },
                id: currentId ? { not: currentId } : undefined,
                isDiscontinued: false,
            },
            select: finitionCardSelect,
            take: limit,
        });

        return results as unknown as FinitionCard[];
    } catch (error) {
        console.error("Failed to fetch similar cars:", error);
        return [];
    }
}

export async function getPromotedCars(): Promise<FinitionCard[]> {
    try {
        const finitions = await prisma.finition.findMany({
            take: 8,
            select: finitionCardSelect,
            orderBy: [
                { isPromoted: "desc" },
                { carModel: { aiScore: "desc" } },
                { createdAt: "desc" }
            ],
            where: {
                isDiscontinued: false,
                isPromoted: true,
            }
        });

        return finitions as unknown as FinitionCard[];
    } catch (error) {
        console.error("Failed to fetch promoted cars:", error);
        return [];
    }
}

export async function getFilteredCars(filters: any, skip: number = 0, take: number = 12): Promise<FinitionCard[]> {
    try {
        const {
            brand, category, priceMin, priceMax, energy, transmission, seats, aiScoreMin, sort
        } = filters;

        const where: any = {
            isDiscontinued: false,
        };

        if (brand && brand !== "all") {
            where.carModel = { ...where.carModel, brand: { slug: brand } };
        }
        if (category && category !== "all") {
            where.carModel = { ...where.carModel, category: category as any };
        }
        if (priceMin || priceMax) {
            where.basePrice = {
                ...(priceMin && { gte: parseFloat(priceMin) }),
                ...(priceMax && { lte: parseFloat(priceMax) }),
            };
        }
        if (energy && energy !== "all") {
            where.technicalSpecs = { ...where.technicalSpecs, fuelType: energy as any };
        }
        if (transmission && transmission !== "all") {
            where.technicalSpecs = { ...where.technicalSpecs, transmission: transmission as any };
        }
        if (seats && seats !== "all") {
            where.technicalSpecs = { ...where.technicalSpecs, seats: parseInt(seats) };
        }
        if (aiScoreMin) {
            where.carModel = { ...where.carModel, aiScore: { gte: parseFloat(aiScoreMin) } };
        }

        let orderBy: any = { createdAt: "desc" };
        if (sort) {
            switch (sort) {
                case "price_asc": orderBy = { basePrice: "asc" }; break;
                case "price_desc": orderBy = { basePrice: "desc" }; break;
                case "ai_score": orderBy = { carModel: { aiScore: "desc" } }; break;
                case "newest": orderBy = { createdAt: "desc" }; break;
                case "promotions": orderBy = { isPromoted: "desc" }; break;
            }
        }

        const finitions = await prisma.finition.findMany({
            where,
            select: finitionCardSelect,
            orderBy,
            skip,
            take
        });

        return finitions as unknown as FinitionCard[];
    } catch (error) {
        console.error("Failed to fetch filtered cars:", error);
        return [];
    }
}

// ==========================================
// UTILS
// ==========================================


