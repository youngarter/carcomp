"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
