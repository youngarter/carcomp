import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFinitionDetails, getSimilarCars, getReviewsForModel } from "../../../actions";
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
} from "lucide-react";
import Image from "next/image";

// Components
import Breadcrumbs from "../../../components/Breadcrumbs";
import ImageGallery from "../../../components/ImageGallery";
import MotionWrapper from "../../../components/MotionWrapper";

// New Tabs Components
import DetailTabs from "../../../components/DetailTabs";
import TechnicalSpecs from "../../../components/TechnicalSpecs";
import AIAnalysisTab from "../../../components/AIAnalysisTab";
import ReviewsTab from "../../../components/ReviewsTab";
import CompareTab from "../../../components/CompareTab";

interface PageProps {
    params: {
        brand: string;
        model: string;
        finition: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { brand, model, finition } = await params;
    const car = await getFinitionDetails(brand, model, finition);

    if (!car) {
        return {
            title: "Véhicule non trouvé",
        };
    }

    const title = `${car.carModel.brand.name} ${car.carModel.name} ${car.name} – Prix Maroc`;
    const description = `Découvrez tous les détails sur le ${car.carModel.name} version ${car.name} par ${car.carModel.brand.name}. Prix, consommation, performances et analyse IA.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: (car.image || car.carModel.image) ? [car.image || car.carModel.image!] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: (car.image || car.carModel.image) ? [car.image || car.carModel.image!] : [],
        },
    };
}

export default async function CarDetailPage({ params }: PageProps) {
    const { brand, model, finition } = await params;
    const data = await getFinitionDetails(brand, model, finition);
    if (!data) notFound();

    const [similarCars, reviews] = await Promise.all([
        getSimilarCars(data.carModel.category, data.id),
        getReviewsForModel(data.carModelId)
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

    const tabsData = [
        {
            id: "fiche-technique",
            label: "Fiche Technique",
            icon: <FileText className="w-4 h-4" />,
            content: <TechnicalSpecs specs={{
                moteur: {
                    energie: data.energy || null,
                    motorisation: data.motorisation || null,
                    puissanceDynamique: data.power ? `${data.power} ch` : null,
                    transmission: data.transmission || null,
                    boiteAVitesse: data.gearbox || null,
                    puissanceFiscale: data.fiscalPower,
                    cylindree: data.cylindree,
                    coupleMax: data.coupleMax,
                    emplacementMoteur: data.emplacement,
                    palettesVolant: data.palettesVolant,
                    puissanceThermique: data.powerThermique,
                    puissanceElectrique: data.powerElec,
                    capaciteBatterie: data.batteryCapacity,
                },
                securite: {
                    airbags: data.airbags,
                    abs: data.abs,
                    esp: data.esp,
                    isofix: data.isofix,
                    antipatinage: data.antipatinage,
                    aideFreinageUrgence: data.aideFreinageUrgence,
                    detecteurAngleMort: data.detecteurAngleMort,
                    maintienVoie: data.maintienVoie,
                    detecteurFatigue: data.detecteurFatigue,
                    antidemarrage: data.antidemarrage,
                    aideDemarrageCote: data.aideDemarrageCote,
                    modeConduite: data.modeConduite,
                    detecteurSousGonflage: data.detecteurSousGonflage,
                    fermetureAuto: data.fermetureAuto,
                    pharesAntibrouillard: data.pharesAntibrouillard,
                    alarme: data.alarme,
                },
                dimensions: {
                    places: data.seats,
                    volumeCoffre: data.trunkVolume,
                    volumeReservoir: data.tankVolume,
                    poids: data.weight,
                    longueur: data.length,
                    largeur: data.width,
                    hauteur: data.height,
                    empattement: data.wheelbase,
                },
                consoPerformances: {
                    consoMixte: data.consoMixed,
                    consoVille: data.consoCity,
                    consoRoute: data.consoRoad,
                    co2Emission: data.co2Emission,
                    vitesseMax: data.maxSpeed ? `${data.maxSpeed} km/h` : null,
                    acceleration: data.acceleration ? `${data.acceleration}s` : null,
                },
                confort: {
                    climatisation: data.climatisation,
                    cameraRecul: data.cameraRecul,
                    ecranTactile: data.ecranTactile,
                    appleCarplay: data.appleCarplay,
                    androidAuto: data.androidAuto,
                    navigationGps: data.navigationGps,
                    mainsLibres: data.mainsLibres,
                    radarStationnement: data.radarStationnement,
                    bluetooth: data.bluetooth,
                    cockpitDigital: data.cockpitDigital,
                    chargeurSansFil: data.chargeurSansFil,
                    parkAssist: data.parkAssist,
                    systemeAudio: data.systemeAudio,
                    ordinateurBord: data.ordinateurBord,
                    startStop: data.startStop,
                    regulateurVitesse: data.regulateurVitesse,
                    detecteurPluie: data.detecteurPluie,
                    allumageAutoFeux: data.allumageAutoFeux,
                    freinMainElectrique: data.freinMainElectrique,
                    reconnaissancePanneaux: data.reconnaissancePanneaux,
                    affichageTeteHaute: data.affichageTeteHaute,
                    commandesVolant: data.commandesVolant,
                    commandesVocales: data.commandesVocales,
                    volantReglable: data.volantReglable,
                    vitresElectriques: data.vitresElectriques,
                    retrosElectriques: data.retrosElectriques,
                    retrosRabattables: data.retrosRabattables,
                    coffreElectrique: data.coffreElectrique,
                    siegesElectriques: data.siegesElectriques,
                    siegesMemoire: data.siegesMemoire,
                    banquetteRabattable: data.banquetteRabattable,
                    wifi: data.wifi,
                },
                esthetique: {
                    jantesAlu: data.jantesAlu,
                    sellerie: data.sellerie,
                    phares: data.phares,
                    toit: data.toit,
                    vitresSurteintees: data.vitresSurteintees,
                    volantCuir: data.volantCuir,
                    followMeHome: data.followMeHome,
                    lumiereAmbiance: data.lumiereAmbiance,
                    feuxJour: data.feuxJour,
                    barresToit: data.barresToit,
                }
            }} />
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
                    performance: data.power && data.power > 150 ? 8.5 : 7.0,
                    economie: data.consoMixed && data.consoMixed < 6 ? 9.0 : 6.5,
                    confort: 8.5,
                    technologie: data.ecranTactile ? 8.5 : 6.0,
                }}
            />
        },
        {
            id: "avis",
            label: "Avis",
            icon: <MessageSquare className="w-4 h-4" />,
            content: <ReviewsTab reviews={reviews} carModelId={data.carModelId} />
        },
        {
            id: "comparer",
            label: "Comparer",
            icon: <ArrowLeftRight className="w-4 h-4" />,
            content: <CompareTab carId={data.id} similarCars={similarCars} />
        }
    ];

    return (
        <MotionWrapper
            className="min-h-screen bg-[#FDFDFF] pt-10 pb-20 font-sans"
        >
            {/* SCHEMA.ORG JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": `${data.carModel.brand.name} ${data.carModel.name} ${data.name}`,
                        "category": "Vehicle",
                        "image": data.image || data.carModel.image,
                        "description": `${data.carModel.brand.name} ${data.carModel.name} ${data.name} - prix, fiche technique et avis.`,
                        "brand": {
                            "@type": "Brand",
                            "name": data.carModel.brand.name
                        },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "MAD",
                            "price": data.startPrice,
                            "availability": "https://schema.org/InStock",
                            "url": `https://autoadvisor.ma/car/${data.carModel.brand.slug}/${data.carModel.slug}/${data.slug}`
                        },
                        "aggregateRating": reviews.length > 0 ? {
                            "@type": "AggregateRating",
                            "ratingValue": (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1),
                            "reviewCount": reviews.length,
                            "bestRating": "5",
                            "worstRating": "1"
                        } : undefined,
                        "additionalProperty": [
                            {
                                "@type": "PropertyValue",
                                "name": "Power",
                                "value": `${data.power} HP`
                            },
                            {
                                "@type": "PropertyValue",
                                "name": "Fuel Economy",
                                "value": `${data.consoMixed} L/100km`
                            }
                        ]
                    }).replace(/<\/script>/gi, '<\/script>')
                }}
            />

            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">
                <Breadcrumbs items={breadcrumbItems} />

                {/* HERO SECTION */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 mt-8">
                    {/* Left: Gallery */}
                    <ImageGallery
                        images={data.images && data.images.length > 0 ? data.images : [data.image || data.carModel.image || ""]}
                        alt={`${data.carModel.brand.name} ${data.carModel.name}`}
                    />

                    {/* Right: Info */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            {data.carModel.brand.logo && (
                                <div className="w-12 h-12 relative grayscale opacity-40">
                                    <Image src={data.carModel.brand.logo} alt={data.carModel.brand.name} fill sizes="48px" className="object-contain" />
                                </div>
                            )}
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none flex items-center">
                                    {data.carModel.category}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black text-zinc-900 mb-2 leading-[1.05] tracking-tight">
                            {data.carModel.brand.name} {data.carModel.name}
                        </h1>
                        <h2 className="text-2xl text-emerald-500 font-bold mb-8 tracking-tight">
                            {data.name}
                        </h2>

                        {/* Price */}
                        <div className="mb-10">
                            <p className="text-zinc-400 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">Prix Maroc à partir de</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-black text-zinc-900 tracking-tighter tabular-nums">
                                    {data.startPrice?.toLocaleString('fr-FR')} <span className="text-2xl text-zinc-400">MAD</span>
                                </span>
                            </div>
                        </div>

                        {/* 4 Key Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-emerald-500 bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><Fuel className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Énergie</span>
                                <span className="text-sm font-black text-zinc-900 tabular-nums">{data.energy || "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-indigo-500 bg-indigo-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><Gauge className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Boîte de vitesse</span>
                                <span className="text-sm font-black text-zinc-900 tabular-nums line-clamp-1">{data.gearbox || "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-amber-500 bg-amber-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><Zap className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Puissance</span>
                                <span className="text-sm font-black text-zinc-900 tabular-nums">{data.power ? `${data.power} ch` : "N/A"}</span>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 border border-zinc-100 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                <div className="text-blue-500 bg-blue-50 w-8 h-8 rounded-full flex items-center justify-center mb-1"><FileText className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conso. mixte</span>
                                <span className="text-sm font-black text-zinc-900 tabular-nums">{data.consoMixed ? `${data.consoMixed} L/100` : "N/A"}</span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <button type="button" aria-label="Demander un devis" className="flex-1 min-w-[200px] bg-emerald-500 text-white px-8 py-5 rounded-[40px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.3)]">
                                Demander un devis
                            </button>
                            <button type="button" aria-label="Comparer ce modèle" className="flex-1 min-w-[150px] bg-zinc-900 text-white px-8 py-5 rounded-[40px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-[0_15px_30px_rgba(0,0,0,0.2)]">
                                <ArrowLeftRight className="w-4 h-4" /> Comparer
                            </button>
                            <div className="flex gap-4">
                                <button type="button" aria-label="Ajouter aux favoris" className="w-[60px] h-[60px] bg-white border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors shadow-soft active:scale-95 flex items-center justify-center text-zinc-400 hover:text-rose-500 shadow-sm">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button type="button" aria-label="Partager ce modèle" className="w-[60px] h-[60px] bg-white border border-zinc-100 rounded-full hover:bg-zinc-50 transition-colors shadow-soft active:scale-95 flex items-center justify-center text-zinc-400 hover:text-zinc-600 shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TABS SECTION */}
                <section className="mb-24">
                    <DetailTabs tabs={tabsData} />
                </section>

                {/* Youtube Section */}
                {data.youtubeVideo && (
                    <section className="py-24 border-t border-zinc-50">
                        <h2 className="text-4xl font-black text-zinc-900 mb-12 tracking-tight text-center">Essai Vidéo</h2>
                        <div className="aspect-video w-full max-w-5xl mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white">
                            <iframe
                                className="w-full h-full"
                                src={data.youtubeVideo.replace('watch?v=', 'embed/')}
                                title="Essai auto"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </section>
                )}
            </div>
        </MotionWrapper>
    );
}

export async function generateStaticParams() {
    try {
        const finitions = await prisma.finition.findMany({
            include: {
                carModel: {
                    include: {
                        brand: true
                    }
                }
            },
            take: 50 // Limit for build speed during development
        });

        return finitions.map(f => ({
            brand: f.carModel.brand.slug,
            model: f.carModel.slug,
            finition: f.slug
        }));
    } catch {
        return [];
    }
}
