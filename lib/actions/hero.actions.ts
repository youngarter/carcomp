"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { z } from "zod";

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
