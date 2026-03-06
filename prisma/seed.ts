import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('Seeding database...');

    // 0. Seed Roles and Permissions
    const editCar = await prisma.permission.upsert({
        where: { name: 'EDIT_CAR' },
        update: {},
        create: { name: 'EDIT_CAR' },
    });

    const deleteCar = await prisma.permission.upsert({
        where: { name: 'DELETE_CAR' },
        update: {},
        create: { name: 'DELETE_CAR' },
    });

    const manageUsers = await prisma.permission.upsert({
        where: { name: 'MANAGE_USERS' },
        update: {},
        create: { name: 'MANAGE_USERS' },
    });

    const superAdminRole = await prisma.role.upsert({
        where: { name: 'SUPER_ADMIN' },
        update: {},
        create: {
            name: 'SUPER_ADMIN',
            permissions: {
                connect: [{ id: editCar.id }, { id: deleteCar.id }, { id: manageUsers.id }],
            },
        },
    });

    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            permissions: {
                connect: [{ id: editCar.id }],
            },
        },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
        },
    });

    // Create Initial Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@carcomp.com' },
        update: {},
        create: {
            email: 'admin@carcomp.com',
            name: 'Super Admin',
            password: hashedPassword,
            roleId: superAdminRole.id,
        },
    });

    // 1. Reset Content Data (Optional but good for clean seeds)
    // Note: Order matters due to foreign key constraints
    await prisma.review.deleteMany();
    await prisma.finition.deleteMany();
    await prisma.carModel.deleteMany();
    await prisma.brand.deleteMany();

    // 2. Create Brands
    const tesla = await prisma.brand.upsert({
        where: { name: 'Tesla' },
        update: {},
        create: {
            name: 'Tesla',
            slug: 'tesla',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
        },
    });

    const bmw = await prisma.brand.upsert({
        where: { name: 'BMW' },
        update: {},
        create: {
            name: 'BMW',
            slug: 'bmw',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
        },
    });

    const toyota = await prisma.brand.upsert({
        where: { name: 'Toyota' },
        update: {},
        create: {
            name: 'Toyota',
            slug: 'toyota',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_car_logo.svg',
        },
    });

    const mercedes = await prisma.brand.upsert({
        where: { name: 'Mercedes-Benz' },
        update: {},
        create: {
            name: 'Mercedes-Benz',
            slug: 'mercedes-benz',
            logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/9/90/Mercedes-Benz_logo.svg/1200px-Mercedes-Benz_logo.svg.png',
        },
    });

    // 3. Create Car Models
    const model3 = await prisma.carModel.create({
        data: {
            name: 'Model 3',
            slug: 'model-3',
            brandId: tesla.id,
            category: 'Berline',
            image: 'https://www.tesla.com/sites/default/files/images/model-3/model-3-hero.jpg',
            aiScore: 9.1,
            reliability: 8.5,
            maintCost: 450,
        },
    });

    const x5 = await prisma.carModel.create({
        data: {
            name: 'X5',
            slug: 'x5',
            brandId: bmw.id,
            category: 'SUV',
            image: 'https://www.bmw.fr/content/dam/bmw/common/all-models/x-series/x5/2023/highlights/bmw-x5-highlights-desktop-01.jpg',
            aiScore: 8.7,
            reliability: 7.8,
            maintCost: 1400,
        },
    });

    const rav4 = await prisma.carModel.create({
        data: {
            name: 'RAV4',
            slug: 'rav4',
            brandId: toyota.id,
            category: 'SUV',
            image: 'https://www.toyota.fr/content/dam/toyota/nmsc/france/gamme/rav4-hybride/rav4-hybride-2023-selection.png',
            aiScore: 8.4,
            reliability: 9.6,
            maintCost: 650,
        },
    });

    // 4. Create Finitions
    // Model 3 Finitions
    await prisma.finition.create({
        data: {
            name: 'Standard Range',
            slug: 'model-3-standard-range',
            carModelId: model3.id,
            price: 39990,
            motorisation: 'RWD 283ch',
            energy: 'Electrique',
            transmission: 'Propulsion',
            power: 283,
            acceleration: 6.1,
            maxSpeed: 201,
            bodyType: 'Berline',
            seats: 5,
            abs: true,
            esp: true,
            cameraRecul: true,
            ecranTactile: true,
            navigationGps: true,
            bluetooth: true,
            appleCarplay: false, // Tesla doesn't have it natively
            phares: 'LED',
        },
    });

    await prisma.finition.create({
        data: {
            name: 'Long Range AWD',
            slug: 'model-3-long-range-awd',
            carModelId: model3.id,
            price: 49990,
            motorisation: 'AWD 498ch',
            energy: 'Electrique',
            transmission: 'Intégrale',
            power: 498,
            acceleration: 4.4,
            maxSpeed: 201,
            bodyType: 'Berline',
            seats: 5,
            abs: true,
            esp: true,
            cameraRecul: true,
            ecranTactile: true,
            navigationGps: true,
            phares: 'LED',
            vitresSurteintees: true,
        },
    });

    // X5 Finitions
    await prisma.finition.create({
        data: {
            name: 'xDrive50e M Sport',
            slug: 'x5-xdrive50e-m-sport',
            carModelId: x5.id,
            price: 108350,
            motorisation: 'Hybride Rechargeable 489ch',
            energy: 'Hybride',
            transmission: 'Automatique',
            power: 489,
            acceleration: 4.8,
            maxSpeed: 250,
            consoMixed: 0.8,
            co2Emission: 18,
            bodyType: 'SUV',
            seats: 5,
            abs: true,
            esp: true,
            climatisation: 'Tri-zone',
            systemeAudio: 'Harman Kardon',
            navigationGps: true,
            cameraRecul: true,
            radarStationnement: 'Avant/Arrière',
            toit: 'Ouvrant',
            jantesAlu: '21 pouces',
        },
    });

    // 5. Create Reviews
    await prisma.review.create({
        data: {
            carModelId: model3.id,
            rating: 5,
            comment: 'Meilleur rapport qualité/prix pour une électrique aujourd\'hui.',
            userName: 'Thomas R.',
        },
    });

    await prisma.review.create({
        data: {
            carModelId: model3.id,
            rating: 4,
            comment: 'Performance incroyable, mais l\'ergonomie tout écran demande un temps d\'adaptation.',
            userName: 'Sophie M.',
            isAiSummary: false,
        },
    });

    await prisma.review.create({
        data: {
            carModelId: x5.id,
            rating: 5,
            comment: 'L\'hybride est parfait pour la ville et les longs trajets. Finition exemplaire.',
            userName: 'Marc-Antoine',
        },
    });

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });