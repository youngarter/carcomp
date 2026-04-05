import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/actions/utils.actions";

export async function main() {
    try {
        console.log("Starting backfill...");

        // 1. Finitions
        const finitions = await prisma.finition.findMany({
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
        const brands = await prisma.brand.findMany();
        for (const b of brands) {
            const slug = generateSlug(b.name);
            await prisma.brand.update({
                where: { id: b.id },
                data: { slug }
            });
        }

        console.log("Backfill completed!");
    } catch (error) {
        console.error("Backfill failed:", error);
    }
}

if (require.main === module) {
    main();
}
