const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/Benfatih/Projects/NextJS/carcomp';

const componentMigrations = {
    '@/app/car/components/Header': '@/components/shared/Header',
    '@/app/car/components/Footer': '@/components/shared/Footer',
    '@/app/car/components/VehicleCard': '@/components/shared/VehicleCard',
    '@/app/car/components/FeatureBadge': '@/components/ui/FeatureBadge',
    '@/app/car/components/SpecItem': '@/components/ui/SpecItem',
    '@/app/car/components/MotionWrapper': '@/components/ui/MotionWrapper',
    '@/app/car/components/HeroCarousel': '@/app/(home)/_components/HeroCarousel',
    '@/app/car/components/BrandsGrid': '@/app/(home)/_components/BrandsGrid',
    '@/app/car/components/AIComparisons': '@/app/(home)/_components/AIComparisons',
    '@/app/car/components/UserExperiences': '@/app/(home)/_components/UserExperiences',
    '@/app/car/components/FeaturedArticles': '@/app/(home)/_components/FeaturedArticles',
    '@/app/car/components/HomePageClient': '@/app/(home)/_components/HomePageClient',
};

const actionMigrations = {
    'getHeroSlides': '@/lib/actions/hero.actions',
    'getActiveHeroSlides': '@/lib/actions/hero.actions',
    'createHeroSlide': '@/lib/actions/hero.actions',
    'updateHeroSlide': '@/lib/actions/hero.actions',
    'deleteHeroSlide': '@/lib/actions/hero.actions',
    'getBrands': '@/lib/actions/brand.actions',
    'getModelsByBrand': '@/lib/actions/brand.actions',
    'getFinitionsByModel': '@/lib/actions/brand.actions',
    'getReviewsForModel': '@/lib/actions/review.actions',
    'submitReview': '@/lib/actions/review.actions',
    'signupFromInvitation': '@/lib/actions/auth.actions',
    'createInvitation': '@/lib/actions/admin.actions',
    'createRole': '@/lib/actions/admin.actions',
    'updateRolePermissions': '@/lib/actions/admin.actions',
    'getCategories': '@/lib/actions/alaune.actions',
    'createCategory': '@/lib/actions/alaune.actions',
    'updateCategory': '@/lib/actions/alaune.actions',
    'deleteCategory': '@/lib/actions/alaune.actions',
    'getArticles': '@/lib/actions/alaune.actions',
    'getArticleById': '@/lib/actions/alaune.actions',
    'getArticleBySlug': '@/lib/actions/alaune.actions',
    'createArticle': '@/lib/actions/alaune.actions',
    'updateArticle': '@/lib/actions/alaune.actions',
    'deleteArticle': '@/lib/actions/alaune.actions',
};

// All other actions in app/car/actions or lib/actions default to car.actions
const defaultCarActionFile = '@/lib/actions/car.actions';

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                getAllFiles(filePath, fileList);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const files = getAllFiles(projectRoot);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix component imports
    for (const [oldPath, newPath] of Object.entries(componentMigrations)) {
        if (content.includes(oldPath)) {
            content = content.replace(new RegExp(oldPath, 'g'), newPath);
            changed = true;
        }
    }

    // Fix generic car component imports (the ones left in _components)
    if (content.includes('@/app/car/components/')) {
        content = content.replace(/@\/app\/car\/components\//g, '@/app/car/_components/');
        changed = true;
    }

    // Fix action imports from app/car/actions or lib/actions or app/actions
    const actionImportRegex = /import\s+\{([^}]+)\}\s+from\s+["'](@\/app\/car\/actions|@\/lib\/actions\/admin|@\/lib\/actions\/auth|@\/app\/admin\/alaune\/alaune\.actions|@\/app\/actions\/brand\.actions)["']/g;

    content = content.replace(actionImportRegex, (match, imports, oldPath) => {
        changed = true;
        const individualImports = imports.split(',').map(i => i.trim());
        const groupedImports = {};

        individualImports.forEach(imp => {
            const cleanImp = imp.split(' as ')[0];
            const targetFile = actionMigrations[cleanImp] || defaultCarActionFile;
            if (!groupedImports[targetFile]) groupedImports[targetFile] = [];
            groupedImports[targetFile].push(imp);
        });

        return Object.entries(groupedImports)
            .map(([file, imps]) => `import { ${imps.join(', ')} } from "${file}"`)
            .join('\n');
    });

    if (changed) {
        console.log(`Updated ${file}`);
        fs.writeFileSync(file, content);
    }
});
