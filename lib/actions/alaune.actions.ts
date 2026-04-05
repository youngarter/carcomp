"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { ArticleInput, CategoryInput, ArticleSchema, CategorySchema, Article, Category } from "@/types/alaune.types";
import { generateSlug } from "./utils.actions";

// ==============================
// CATEGORIES
// ==============================

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" }
        });
        return { success: true, data: categories as Category[] };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: "Erreur lors de la récupération des catégories" };
    }
}

export async function createCategory(input: CategoryInput) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { success: false, error: "Non autorisé" };
        }

        const parsed = CategorySchema.parse(input);
        const slug = generateSlug(parsed.name);

        const category = await prisma.category.create({
            data: {
                name: parsed.name,
                slug,
            }
        });

        revalidatePath("/admin/alaune");
        revalidatePath("/admin/alaune/categories");
        return { success: true, data: category };
    } catch (error) {
        console.error("Error creating category:", error);
        return { success: false, error: "Erreur lors de la création de la catégorie" };
    }
}

export async function updateCategory(id: string, input: CategoryInput) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { success: false, error: "Non autorisé" };
        }

        const parsed = CategorySchema.parse(input);

        const category = await prisma.category.update({
            where: { id },
            data: {
                name: parsed.name,
            }
        });

        revalidatePath("/admin/alaune");
        revalidatePath("/admin/alaune/categories");
        return { success: true, data: category };
    } catch (error) {
        console.error("Error updating category:", error);
        return { success: false, error: "Erreur lors de la mise à jour de la catégorie" };
    }
}

export async function deleteCategory(id: string) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { success: false, error: "Non autorisé" };
        }

        const category = await prisma.category.delete({
            where: { id }
        });

        revalidatePath("/admin/alaune");
        revalidatePath("/admin/alaune/categories");
        return { success: true, data: category };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, error: "Erreur lors de la suppression de la catégorie" };
    }
}

// ==============================
// ARTICLES
// ==============================

export async function getArticles(): Promise<{ success: boolean; data?: Article[]; error?: string }> {
    try {
        const articles = await prisma.article.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" }
        });
        return { success: true, data: articles as Article[] };
    } catch (error) {
        console.error("Error fetching articles:", error);
        return { success: false, error: "Erreur lors de la récupération des articles" };
    }
}

export async function getArticleById(id: string): Promise<{ success: boolean; data?: Article; error?: string }> {
    try {
        const article = await prisma.article.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!article) return { success: false, error: "Article non trouvé" };
        return { success: true, data: article as Article };
    } catch (error) {
        console.error("Error fetching article:", error);
        return { success: false, error: "Erreur lors de la récupération de l'article" };
    }
}

export async function getArticleBySlug(slug: string): Promise<{ success: boolean; data?: Article; error?: string }> {
    try {
        const article = await prisma.article.findUnique({
            where: { slug },
            include: { category: true }
        });
        if (!article) return { success: false, error: "Article non trouvé" };
        return { success: true, data: article as Article };
    } catch (error) {
        console.error("Error fetching article by slug:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

export async function createArticle(input: ArticleInput) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { success: false, error: "Non autorisé" };
        }

        const parsed = ArticleSchema.parse(input);
        const slug = generateSlug(parsed.title);

        const article = await prisma.article.create({
            data: {
                title: parsed.title,
                subtitle: parsed.subtitle,
                slug,
                content: parsed.content,
                coverImage: parsed.coverImage,
                images: parsed.images,
                categoryId: parsed.categoryId,
            }
        });

        revalidatePath("/admin/alaune");
        revalidatePath("/alaune");
        return { success: true, data: article };
    } catch (error) {
        console.error("Error creating article:", error);
        return { success: false, error: "Erreur lors de la création de l'article" };
    }
}

export async function updateArticle(id: string, input: ArticleInput) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { success: false, error: "Non autorisé" };
        }

        const parsed = ArticleSchema.parse(input);

        const article = await prisma.article.update({
            where: { id },
            data: {
                title: parsed.title,
                subtitle: parsed.subtitle,
                content: parsed.content,
                coverImage: parsed.coverImage,
                images: parsed.images,
                categoryId: parsed.categoryId,
            }
        });

        revalidatePath("/admin/alaune");
        revalidatePath(`/alaune/${article.slug}`);
        return { success: true, data: article };
    } catch (error) {
        console.error("Error updating article:", error);
        return { success: false, error: "Erreur lors de la mise à jour de l'article" };
    }
}

export async function deleteArticle(id: string) {
    try {
        const session = await auth();
        if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
            return { success: false, error: "Non autorisé" };
        }

        const article = await prisma.article.delete({
            where: { id }
        });

        revalidatePath("/admin/alaune");
        revalidatePath("/alaune");
        return { success: true, data: article };
    } catch (error) {
        console.error("Error deleting article:", error);
        return { success: false, error: "Erreur lors de la suppression de l'article" };
    }
}
