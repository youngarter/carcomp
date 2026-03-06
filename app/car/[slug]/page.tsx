import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFinitionBySlug } from "../actions";
import { ArrowLeft, Star, Zap } from "lucide-react";
import Link from "next/link";

// Components
import TechnicalSpecs from "../components/TechnicalSpecs";
import PredictiveIntelligence from "../components/PredictiveIntelligence";
import CarDetailsClient from "./CarDetailsClient";

interface PageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const car = await getFinitionBySlug(slug);

    if (!car) {
        return {
            title: "Véhicule non trouvé - AutoAdvisor AI",
        };
    }

    return {
        title: `${car.carModel.brand.name} ${car.carModel.name} ${car.name} - Prix Maroc | AutoAdvisor AI`,
        description: `Découvrez le prix, la fiche technique et l'analyse IA du ${car.carModel.brand.name} ${car.carModel.name} version ${car.name} au Maroc. ${car.motorisation} ${car.power ? car.power + 'ch' : ''}.`,
        openGraph: {
            title: `${car.carModel.brand.name} ${car.carModel.name} ${car.name}`,
            description: `Prix et fiche technique au Maroc.`,
            images: [car.image || car.carModel.image || ""],
        }
    };
}

export default async function CarDetailsPage({ params }: PageProps) {
    const { slug } = await params;
    const data = await getFinitionBySlug(slug);

    if (!data) {
        notFound();
    }

    // Map the database format to our Car type
    const car: any = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        price: data.price,
        images: data.images || [],
        model: {
            name: data.carModel.name,
            brand: { name: data.carModel.brand.name },
            category: data.carModel.category,
            imageUrl: data.carModel.image,
            aiScore: data.carModel.aiScore,
            reliability: data.carModel.reliability,
            maintCost: data.carModel.maintCost,
        },
        specs: {
            moteur: {
                energie: data.energy,
                motorisation: data.motorisation,
                puissanceDynamique: data.power ? `${data.power}ch` : null,
                transmission: data.transmission,
                boiteAVitesse: data.gearbox,
                emplacement: data.emplacement,
                fiscalPower: data.fiscalPower,
                cylindree: data.cylindree,
                coupleMax: data.coupleMax,
                palettesVolant: data.palettesVolant,
                powerThermique: data.powerThermique,
                powerElec: data.powerElec,
                batteryCapacity: data.batteryCapacity
            },
            consoPerformances: {
                consoMixte: data.consoMixed?.toString(),
                co2Emission: data.co2Emission?.toString(),
                vitesseMax: data.maxSpeed ? `${data.maxSpeed} km/h` : null,
                acceleration: data.acceleration ? `${data.acceleration}s` : null,
                consoCity: data.consoCity,
                consoRoad: data.consoRoad
            },
            dimensions: {
                places: data.seats,
                volumeCoffre: data.trunkVolume,
                volumeReservoir: data.tankVolume,
                poids: data.weight,
                longueur: data.length,
                largeur: data.width,
                hauteur: data.height,
                empattement: data.wheelbase
            },
            securite: {
                airbags: data.airbags,
                abs: data.abs,
                esp: data.esp,
                isofix: data.isofix,
                antipatinage: data.antipatinage,
                aideFreinageUrgence: data.aideFreinageUrgence,
                antidemarrage: data.antidemarrage,
                aideDemarrageCote: data.aideDemarrageCote,
                modeConduite: data.modeConduite,
                detecteurFatigue: data.detecteurFatigue,
                maintienVoie: data.maintienVoie,
                detecteurAngleMort: data.detecteurAngleMort,
                detecteurSousGonflage: data.detecteurSousGonflage,
                fermetureAuto: data.fermetureAuto,
                pharesAntibrouillard: data.pharesAntibrouillard,
                alarme: data.alarme
            },
            confort: {
                climatisation: data.climatisation,
                systemeAudio: data.systemeAudio,
                ordinateurBord: data.ordinateurBord,
                startStop: data.startStop,
                regulateurVitesse: data.regulateurVitesse,
                detecteurPluie: data.detecteurPluie,
                allumageAutoFeux: data.allumageAutoFeux,
                freinMainElectrique: data.freinMainElectrique,
                ecranTactile: data.ecranTactile,
                cockpitDigital: data.cockpitDigital,
                reconnaissancePanneaux: data.reconnaissancePanneaux,
                affichageTeteHaute: data.affichageTeteHaute,
                cameraRecul: data.cameraRecul,
                radarStationnement: data.radarStationnement,
                parkAssist: data.parkAssist,
                commandesVolant: data.commandesVolant,
                commandesVocales: data.commandesVocales,
                volantReglable: data.volantReglable,
                vitresElectriques: data.vitresElectriques,
                retrosElectriques: data.retrosElectriques,
                retrosRabattables: data.retrosRabattables,
                coffreElectrique: data.coffreElectrique,
                mainsLibres: data.mainsLibres,
                siegesElectriques: data.siegesElectriques,
                siegesMemoire: data.siegesMemoire,
                banquetteRabattable: data.banquetteRabattable,
                navigationGps: data.navigationGps,
                wifi: data.wifi,
                bluetooth: data.bluetooth,
                appleCarplay: data.appleCarplay,
                chargeurSansFil: data.chargeurSansFil
            },
            esthetique: {
                jantesAlu: data.jantesAlu,
                sellerie: data.sellerie,
                volantCuir: data.volantCuir,
                followMeHome: data.followMeHome,
                lumiereAmbiance: data.lumiereAmbiance,
                feuxJour: data.feuxJour,
                phares: data.phares,
                toit: data.toit,
                barresToit: data.barresToit,
                vitresSurteintees: data.vitresSurteintees
            }
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-[#F9FAFB]">
            <div className="max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
                </Link>

                <CarDetailsClient car={car} />
            </div>
        </main>
    );
}
