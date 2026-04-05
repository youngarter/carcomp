import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFinitionDetails, getSimilarCars } from "@/lib/actions/car.actions";
import { getReviewsForModel } from "@/lib/actions/review.actions";
import { prisma } from "@/lib/db";
import {
    Heart,
    Share2,
    Gauge,
    Fuel,
    FileText,
    BrainCircuit,
    MessageSquare,
    ArrowLeftRight,
    Zap,
    TrendingDown,
} from "lucide-react";
import Image from "next/image";

// Components
import Breadcrumbs from "@/app/(main)/car/_components/Breadcrumbs";
import ImageGallery from "@/app/(main)/car/_components/ImageGallery";
import MotionWrapper from "@/app/(main)/car/_components/MotionWrapper";

// Tab Components
import DetailTabs from "@/app/(main)/car/_components/DetailTabs";
import TechnicalSpecs from "@/app/(main)/car/_components/TechnicalSpecs";
import AIAnalysisTab from "@/app/(main)/car/_components/AIAnalysisTab";
import ReviewsTab from "@/app/(main)/car/_components/ReviewsTab";
import CompareTab from "@/app/(main)/car/_components/CompareTab";
import PriceHistoryChart from "@/app/(main)/car/_components/PriceHistoryChart";

interface PageProps {
    params: Promise<{
        brand: string;
        model: string;
        finition: string;
    }>;
}

// ==========================================
// SEO: Dynamic Metadata
// ==========================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brand, model, finition } = await params;
    const car = await getFinitionDetails(
        decodeURIComponent(brand),
        decodeURIComponent(model),
        decodeURIComponent(finition)
    );

    if (!car) {
        return {
            title: "Véhicule non trouvé | AutoAdvisor",
            description: "Ce véhicule n'existe pas ou a été retiré de notre catalogue.",
        };
    }

    const brandName = car.carModel.brand.name;
    const modelName = car.carModel.name;
    const trimName = car.name;
    const price = car.basePrice ? (car.basePrice / 100).toLocaleString("fr-FR") : undefined;
    const energy = car.technicalSpecs?.fuelType || "";
    const power = car.technicalSpecs?.dinPower ? `${car.technicalSpecs.dinPower} ch` : "";

    const title = `${brandName} ${modelName} ${trimName} – Prix ${price ? price + " MAD" : ""} | AutoAdvisor Maroc`;
    const description = `${brandName} ${modelName} ${trimName}${energy ? ` ${energy}` : ""}${power ? ` ${power}` : ""}. Découvrez la fiche technique, prix au Maroc${price ? ` à partir de ${price} MAD` : ""}, consommation, analyse IA et avis utilisateurs.`;
    const canonicalUrl = `https://autoadvisor.ma/car/${car.carModel.brand.slug}/${car.carModel.slug}/${car.slug}`;
    const imageUrl = (car.images && car.images[0]) || car.carModel.image || "";

    return {
        title,
        description,
        keywords: [brandName, modelName, trimName, "prix maroc", "fiche technique", car.carModel.category, energy].filter(Boolean),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "AutoAdvisor Maroc",
            type: "website",
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: `${brandName} ${modelName} ${trimName}` }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

// ==========================================
// PAGE COMPONENT
// ==========================================

export default async function CarDetailPage({ params }: PageProps) {
    const { brand, model, finition } = await params;

    // Decode and sanitize URL params
    const safeBrand = decodeURIComponent(brand).replace(/<[^>]*>/g, "");
    const safeModel = decodeURIComponent(model).replace(/<[^>]*>/g, "");
    const safeFinition = decodeURIComponent(finition).replace(/<[^>]*>/g, "");

    let data;
    try {
        data = await getFinitionDetails(safeBrand, safeModel, safeFinition);
    } catch {
        notFound();
    }
    if (!data) notFound();

    const [similarCars, reviews] = await Promise.all([
        getSimilarCars(data.carModel.category, data.id),
        getReviewsForModel(data.carModelId),
    ]);

    const breadcrumbItems = [
        { label: "Voitures", href: "/car" },
        { label: data.carModel.brand.name, href: `/car?brand=${data.carModel.brand.id}` },
        { label: data.carModel.name, href: `/car?model=${data.carModel.id}` },
        { label: data.name, href: "#" },
    ];

    const aiScore = data.carModel.aiScore || 8.6;
    const reliability = data.carModel.reliability || 8.0;
    const maintCost = data.carModel.maintCost || 7.0;

    // ==========================================
    // TABS DATA
    // ==========================================

    const tabsData = [
        {
            id: "fiche-technique",
            label: "Fiche Technique",
            icon: <FileText className="w-4 h-4" />,
            content: <TechnicalSpecs finition={data} />,
        },
        {
            id: "historique-prix",
            label: "Historique des prix",
            icon: <TrendingDown className="w-4 h-4" />,
            content: <PriceHistoryChart car={data} />,
        },
        {
            id: "analyse-ia",
            label: "Analyse IA",
            icon: <BrainCircuit className="w-4 h-4" />,
            content: <AIAnalysisTab
                aiScore={aiScore}
                reliability={reliability}
                maintCost={maintCost}
                summary={`Le ${data.carModel.brand.name} ${data.carModel.name} se distingue sur le marché marocain par son confort et sa faible consommation. Il est particulièrement adapté aux familles urbaines recherchant un SUV fiable.`}
                pointsForts={["Consommation", "Confort", "Technologie"]}
                pointsFaibles={["Prix", "Puissance", "Espace coffre"]}
                recommandePour={["Familles", "Urbain", "Long trajet", "Jeune conducteur"]}
                scores={{
                    performance: data.technicalSpecs?.dinPower && data.technicalSpecs.dinPower > 150 ? 8.5 : 7.0,
                    economie: data.technicalSpecs?.consoMixed && data.technicalSpecs.consoMixed < 6 ? 9.0 : 6.5,
                    confort: 8.5,
                    technologie: data.comfortFeatures?.digitalCockpit ? 8.5 : 6.0,
                }}
            />,
        },
        {
            id: "avis",
            label: "Avis",
            icon: <MessageSquare className="w-4 h-4" />,
            content: <ReviewsTab reviews={reviews} carModelId={data.carModelId} />,
        },
        {
            id: "comparer",
            label: "Comparer",
            icon: <ArrowLeftRight className="w-4 h-4" />,
            content: <CompareTab carId={data.id} similarCars={similarCars} />,
        },
    ];

    // ==========================================
    // JSON-LD Structured Data
    // ==========================================

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: `${data.carModel.brand.name} ${data.carModel.name} ${data.name}`,
        category: "Vehicle",
        image: (data.images && data.images[0]) || data.carModel.image,
        description: `${data.carModel.brand.name} ${data.carModel.name} ${data.name} - prix, fiche technique et avis au Maroc.`,
        brand: {
            "@type": "Brand",
            name: data.carModel.brand.name,
        },
        offers: {
            "@type": "Offer",
            priceCurrency: "MAD",
            price: data.basePrice ? (data.basePrice / 100).toString() : "0",
            availability: "https://schema.org/InStock",
            url: `https://autoadvisor.ma/car/${data.carModel.brand.slug}/${data.carModel.slug}/${data.slug}`,
        },
        ...(reviews.length > 0 && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1),
                reviewCount: reviews.length,
                bestRating: "5",
                worstRating: "1",
            },
        }),
        additionalProperty: [
            ...(data.technicalSpecs?.fuelType ? [{ "@type": "PropertyValue", name: "Fuel Type", value: data.technicalSpecs.fuelType }] : []),
            ...(data.technicalSpecs?.dinPower ? [{ "@type": "PropertyValue", name: "Power", value: `${data.technicalSpecs.dinPower} HP` }] : []),
            ...(data.technicalSpecs?.consoMixed ? [{ "@type": "PropertyValue", name: "Fuel Economy", value: `${data.technicalSpecs.consoMixed} L/100km` }] : []),
            ...(data.technicalSpecs?.transmission ? [{ "@type": "PropertyValue", name: "Transmission", value: data.technicalSpecs.transmission }] : []),
            ...(data.technicalSpecs?.seats ? [{ "@type": "PropertyValue", name: "Seats", value: `${data.technicalSpecs.seats}` }] : []),
        ],
        vehicleConfiguration: data.name,
        fuelType: data.technicalSpecs?.fuelType || undefined,
        vehicleTransmission: data.technicalSpecs?.transmission || undefined,
    };

    return (
        <MotionWrapper className="min-h-screen bg-[#FDFDFF] pt-6 sm:pt-10 pb-16 sm:pb-20 font-sans">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, "<\\/script>"),
                }}
            />

            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                <Breadcrumbs items={breadcrumbItems} />

                {/* ==========================================
                    HERO SECTION
                ========================================== */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-16 sm:mb-24 mt-4 sm:mt-8">
                    {/* Left: Gallery */}
                    <ImageGallery
                        images={data.images && data.images.length > 0 ? data.images : [data.carModel.image || ""]}
                        alt={`${data.carModel.brand.name} ${data.carModel.name}`}
                    />

                    {/* Right: Info */}
                    <div className="flex flex-col justify-center">
                        {/* TODO: vérifier prq le logo ne s'affiche pas */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                            {data.carModel.brand.logo && (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 relative grayscale opacity-40">
                                    <Image src={data.carModel.brand.logo} alt={data.carModel.brand.name} fill sizes="48px" className="object-contain" />
                                </div>
                            )}
                            <span className="px-4 py-2 bg-zinc-100 text-zinc-500 rounded-lg text-[15px] font-black uppercase tracking-widest leading-none flex items-center">
                                {data.carModel.category}
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 mb-2 leading-[1.05] tracking-tight">
                            {data.carModel.brand.name} {data.carModel.name}
                        </h1>
                        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4 text-emerald-500 font-bold mb-4 sm:mb-8 tracking-tight">
                            {/* TODO: Verification de la source de cette donnée*/}
                            {data.name}
                        </h2>

                        {/* Price */}
                        <div className="mb-8 sm:mb-10">
                            <p className="text-zinc-400 text-[12px] font-black mb-1 uppercase tracking-[0.2em]">Prix Maroc à partir de</p>
                            <div className="flex items-baseline gap-2 sm:gap-3">
                                <span className="text-4xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter tabular-nums">
                                    {data.basePrice ? (data.basePrice / 100).toLocaleString("fr-FR") : "N/A"} <span className="text-lg sm:text-2xl text-zinc-400">MAD</span>
                                </span>
                            </div>
                        </div>

                        {/* 4 Key Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 sm:p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-emerald-500 bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><Fuel className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Énergie</span>
                                <span className="text-xs sm:text-sm font-black text-zinc-900 tabular-nums">{data.technicalSpecs?.fuelType || "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 sm:p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-indigo-500 bg-indigo-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><Gauge className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Boîte</span>
                                <span className="text-xs sm:text-sm font-black text-zinc-900 tabular-nums line-clamp-1">{data.technicalSpecs?.transmission || "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 sm:p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-amber-500 bg-amber-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><Zap className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Puissance</span>
                                <span className="text-xs sm:text-sm font-black text-zinc-900 tabular-nums">{data.technicalSpecs?.dinPower ? `${data.technicalSpecs.dinPower} ch` : "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 sm:p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-blue-500 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><FileText className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conso.</span>
                                <span className="text-xs sm:text-sm font-black text-zinc-900 tabular-nums">{data.technicalSpecs?.consoMixed ? `${data.technicalSpecs.consoMixed} L/100` : "N/A"}</span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                            <button type="button" aria-label="Demander un devis" className="flex-1 min-w-[180px] bg-emerald-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[40px] font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.3)]">
                                Demander un devis
                            </button>
                            <button type="button" aria-label="Comparer ce modèle" className="flex-1 min-w-[140px] bg-zinc-900 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[40px] font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
                                <ArrowLeftRight className="w-4 h-4" /> Comparer
                            </button>
                            <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                                <button type="button" aria-label="Ajouter aux favoris" className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] bg-white border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors active:scale-95 flex items-center justify-center text-zinc-400 hover:text-rose-500 shadow-sm">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button type="button" aria-label="Partager ce modèle" className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] bg-white border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors active:scale-95 flex items-center justify-center text-zinc-400 hover:text-zinc-600 shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==========================================
                    TABS SECTION
                ========================================== */}
                <section className="mb-16 sm:mb-24">
                    <DetailTabs tabs={tabsData} />
                </section>

                {/* ==========================================
                    YOUTUBE SECTION
                ========================================== */}
                {data.youtubeVideo && (
                    <section className="py-16 sm:py-24 border-t border-zinc-50">
                        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-8 sm:mb-12 tracking-tight text-center">Essai Vidéo</h2>
                        <div className="aspect-video w-full max-w-5xl mx-auto rounded-2xl sm:rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white">
                            <iframe
                                className="w-full h-full"
                                src={data.youtubeVideo.replace("watch?v=", "embed/")}
                                title={`Essai vidéo ${data.carModel.brand.name} ${data.carModel.name}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    </section>
                )}
            </div>
        </MotionWrapper>
    );
}

// ==========================================
// STATIC PARAMS (ISR)
// ==========================================

export async function generateStaticParams() {
    try {
        const finitions = await prisma.finition.findMany({
            include: {
                carModel: {
                    include: {
                        brand: true,
                    },
                },
            },
            take: 50,
        });

        return finitions.map((f) => ({
            brand: f.carModel.brand.slug,
            model: f.carModel.slug,
            finition: f.slug,
        }));
    } catch {
        return [];
    }
}
