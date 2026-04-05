"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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

export async function createBrand(formData: FormData) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const origin = formData.get("origin") as string;
    const logo = formData.get("logo") as string;
    const image = formData.get("image") as string;

    try {
        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                description,
                origin,
                logo,
                image,
            },
        });
        revalidatePath("/admin/brands");
        return { success: true, brand };
    } catch (error) {
        console.error("Failed to create brand:", error);
        return { error: "Failed to create brand." };
    }
}

export async function updateBrand(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string)) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const origin = formData.get("origin") as string;
    const logo = formData.get("logo") as string;
    const image = formData.get("image") as string;

    try {
        const brand = await prisma.brand.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                origin,
                logo,
                image,
            },
        });
        revalidatePath("/admin/brands");
        return { success: true, brand };
    } catch (error) {
        console.error("Failed to update brand:", error);
        return { error: "Failed to update brand." };
    }
}

export async function deleteBrand(id: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        return { error: "Seul un Super Admin peut supprimer une marque." };
    }

    try {
        await prisma.brand.delete({
            where: { id },
        });
        revalidatePath("/admin/brands");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete brand:", error);
        return { error: "Erreur lors de la suppression de la marque. Assurez-vous qu'elle n'est pas liée à des modèles." };
    }
}
