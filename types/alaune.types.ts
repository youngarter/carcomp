import { z } from "zod";

export const CategorySchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

export const ArticleSchema = z.object({
    title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
    subtitle: z.string().optional(),
    content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
    coverImage: z.string().optional(),
    images: z.array(z.string()).default([]),
    categoryId: z.string().min(1, "La catégorie est requise"),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;

export interface Category {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Article {
    id: string;
    title: string;
    subtitle?: string | null;
    slug: string;
    content: string;
    coverImage?: string | null;
    images: string[];
    categoryId: string;
    category?: Category;
    createdAt: Date;
    updatedAt: Date;
}
