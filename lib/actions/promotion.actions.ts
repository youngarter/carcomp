"use server";
import { prisma } from "@/lib/db";
import { Promotion } from '@/types/promotion';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/** Get all promotions (records where isPromotion = true) */
export async function getPromotions(): Promise<Promotion[]> {
    const records = await prisma.finitionPriceHistory.findMany({
        where: { isPromotion: true },
        include: {
            finition: {
                select: {
                    id: true,
                    name: true,
                    images: true,
                    carModel: {
                        select: {
                            name: true,
                            image: true,
                            brand: {
                                select: { name: true }
                            }
                        }
                    }
                }
            }
        },
        orderBy: { startDate: 'desc' },
    });
    return records.map((r) => ({
        id: r.id,
        finitionId: r.finitionId,
        price: r.price,
        isPromotion: r.isPromotion,
        promotionalPrice: r.promotionalPrice ?? undefined,
        startDate: r.startDate?.toISOString(),
        endDate: r.endDate?.toISOString(),
        finition: {
            id: r.finition.id,
            name: r.finition.name,
            image: r.finition.images?.[0] || null,
            carModel: r.finition.carModel ? {
                name: r.finition.carModel.name,
                image: r.finition.carModel.image || null,
                brand: r.finition.carModel.brand ? {
                    name: r.finition.carModel.brand.name
                } : null
            } : null
        }
    }));
}

/** Search finitions for creating promotions */
export async function searchFinitions(query: string) {
    if (!query || query.length < 2) return [];

    // We search the Finition table. The field name is 'name'. Also search by car model or brand
    const finitions = await prisma.finition.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { carModel: { name: { contains: query, mode: 'insensitive' } } },
                { carModel: { brand: { name: { contains: query, mode: 'insensitive' } } } },
            ]
        },
        take: 10,
        select: {
            id: true,
            name: true,
            images: true,
            basePrice: true,
            priceHistory: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            carModel: {
                select: {
                    name: true,
                    image: true,
                    brand: { select: { name: true } }
                }
            }
        }
    });

    return finitions.map(f => ({
        id: f.id,
        name: f.name,
        image: f.images?.[0] || f.carModel?.image || null,
        price: f.priceHistory[0]?.price || f.basePrice || 0,
        carModelName: f.carModel?.name || '',
        brandName: f.carModel?.brand?.name || ''
    }));
}

/** Get a single promotion by id */
export async function getPromotion(id: string): Promise<Promotion | null> {
    const r = await prisma.finitionPriceHistory.findUnique({
        where: { id },
        include: {
            finition: {
                select: {
                    id: true,
                    name: true,
                    images: true,
                    carModel: {
                        select: {
                            name: true,
                            image: true,
                            brand: {
                                select: { name: true }
                            }
                        }
                    }
                }
            }
        },
    });
    if (!r || !r.finition) return null;
    return {
        id: r.id,
        finitionId: r.finitionId,
        price: r.price,
        isPromotion: r.isPromotion,
        promotionalPrice: r.promotionalPrice ?? undefined,
        startDate: r.startDate?.toISOString(),
        endDate: r.endDate?.toISOString(),
        finition: {
            id: r.finition.id,
            name: r.finition.name,
            image: r.finition.images?.[0] || null,
            carModel: r.finition.carModel ? {
                name: r.finition.carModel.name,
                image: r.finition.carModel.image || null,
                brand: r.finition.carModel.brand ? {
                    name: r.finition.carModel.brand.name
                } : null
            } : null
        }
    };
}

/** Create a new promotion */
export async function createPromotion(data: {
    finitionId: string;
    price: number;
    promotionalPrice: number;
    startDate: Date;
    endDate?: Date;
}): Promise<Promotion> {
    const r = await prisma.finitionPriceHistory.create({
        data: {
            finitionId: data.finitionId,
            price: data.price,
            isPromotion: true,
            promotionalPrice: data.promotionalPrice,
            startDate: data.startDate,
            endDate: data.endDate,
        },
    });

    revalidatePath('/admin/promotions');
    redirect('/admin/promotions');
}

/** Update an existing promotion */
export async function updatePromotion(id: string, data: {
    price?: number;
    promotionalPrice?: number;
    startDate?: Date;
    endDate?: Date;
    isPromotion?: boolean;
}): Promise<Promotion> {
    const r = await prisma.finitionPriceHistory.update({
        where: { id },
        data: {
            price: data.price,
            promotionalPrice: data.promotionalPrice,
            startDate: data.startDate,
            endDate: data.endDate,
            isPromotion: data.isPromotion,
        },
    });

    revalidatePath('/admin/promotions');
    redirect('/admin/promotions');
}

/** Delete a promotion */
export async function deletePromotion(id: string): Promise<void> {
    await prisma.finitionPriceHistory.delete({ where: { id } });
    revalidatePath('/admin/promotions');
}
