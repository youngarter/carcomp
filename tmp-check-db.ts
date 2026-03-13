import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for Mercedes-Benz data...');

    const brands = await prisma.brand.findMany({
        where: { slug: { contains: 'mercedes' } }
    });
    console.log('Brands found:', JSON.stringify(brands, null, 2));

    if (brands.length > 0) {
        const models = await prisma.carModel.findMany({
            where: { brandId: brands[0].id }
        });
        console.log('Models for brand:', JSON.stringify(models.map(m => ({ id: m.id, name: m.name, slug: m.slug })), null, 2));

        for (const model of models) {
            const finitions = await prisma.finition.findMany({
                where: { carModelId: model.id }
            });
            console.log(`Finitions for model ${model.name}:`, JSON.stringify(finitions.map(f => ({ id: f.id, name: f.name, slug: f.slug })), null, 2));
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
