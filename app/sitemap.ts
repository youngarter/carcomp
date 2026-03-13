import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = "https://autoadvisor.ma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/car`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    // Dynamic: finition detail pages
    let finitionPages: MetadataRoute.Sitemap = [];
    try {
        const finitions = await prisma.finition.findMany({
            select: {
                slug: true,
                updatedAt: true,
                carModel: {
                    select: {
                        slug: true,
                        brand: {
                            select: { slug: true },
                        },
                    },
                },
            },
        });

        finitionPages = finitions.map((f) => ({
            url: `${BASE_URL}/car/${f.carModel.brand.slug}/${f.carModel.slug}/${f.slug}`,
            lastModified: f.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch (err) {
        console.error("Sitemap: Failed to fetch finitions", err);
    }

    // Dynamic: brand pages (car listing by brand)
    let brandPages: MetadataRoute.Sitemap = [];
    try {
        const brands = await prisma.brand.findMany({
            select: { slug: true, updatedAt: true },
        });
        brandPages = brands.map((b) => ({
            url: `${BASE_URL}/car?brand=${b.slug}`,
            lastModified: b.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (err) {
        console.error("Sitemap: Failed to fetch brands", err);
    }

    return [...staticPages, ...finitionPages, ...brandPages];
}
