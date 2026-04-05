"use client";

import React, { useState, useEffect, use } from "react";
import {
    Car, ArrowLeft, Camera, Sparkles,
    Settings, Zap, Shield, Heart, Save, Check, ChevronRight, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { updateCarStepByStep, getFinitionBySlug } from "@/lib/actions/car.actions";
import { Finition, Brand, CarModel } from "@/app/generated/prisma";

export default function EditCarPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [finitionId, setFinitionId] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);

    // Form State
    const [formData, setFormData] = useState<any>({
        brandName: "",
        modelName: "",
        category: "SUV",
        image: "",
        aiScore: "8.0",
        reliability: "8.0",
        maintCost: "500",
        finitionName: "",
        year: "2025",
        price: "",
        isPromoted: false,
        promotionalPrice: "",
        promoStartDate: "",
        promoEndDate: "",
        images: ["", "", "", "", "", "", "", "", "", ""],
        youtubeVideo: "",
        motorisation: "",
        emplacement: "Avant",
        energy: "Diesel",
        fiscalPower: "",
        transmission: "2 roues motrices ( 4x2 ou 2WD )",
        architecture: "",
        cylindree: "",
        coupleMax: "",
        gearbox: "Automatique",
        palettesVolant: "Non",
        power: "",
        powerThermique: "",
        powerElec: "",
        batteryCapacity: "",
        consoCity: "",
        consoRoad: "",
        consoMixed: "",
        co2Emission: "",
        maxSpeed: "",
        acceleration: "",
        bodyType: "",
        seats: "5",
        weight: "",
        length: "",
        width: "",
        height: "",
        wheelbase: "",
        tankVolume: "",
        trunkVolume: "",
        airbags: "8",
        abs: true, esp: true, antipatinage: true, aideFreinageUrgence: true,
        antidemarrage: true, aideDemarrageCote: true, modeConduite: true,
        detecteurFatigue: true, maintienVoie: true, detecteurAngleMort: true,
        detecteurSousGonflage: true, fermetureAuto: true, isofix: true,
        pharesAntibrouillard: true, alarme: true,
        climatisation: "Automatique Bi-zone",
        systemeAudio: "Radio, USB",
        ordinateurBord: true, startStop: true, regulateurVitesse: true,
        detecteurPluie: true, allumageAutoFeux: true, freinMainElectrique: true,
        ecranTactile: true, cockpitDigital: true, reconnaissancePanneaux: true,
        affichageTeteHaute: true, radarStationnement: "Avant et Arrière",
        cameraRecul: true, parkAssist: true, commandesVolant: true,
        commandesVocales: true, volantReglable: "Hauteur et Profondeur",
        vitresElectriques: "Electrique AV/AR",
        retrosElectriques: true, retrosRabattables: true, coffreElectrique: true,
        mainsLibres: true, siegesElectriques: true, siegesMemoire: true,
        banquetteRabattable: "1/3-2/3", navigationGps: true, wifi: true,
        bluetooth: true, appleCarplay: true, chargeurSansFil: true,
        jantesAlu: "17 pouces",
        sellerie: "Similicuir",
        volantCuir: true, followMeHome: true, lumiereAmbiance: true,
        feuxJour: "LED", phares: "Full LED", toit: "Rigide",
        barresToit: false, vitresSurteintees: true,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const car = await getFinitionBySlug(slug) as any;
                if (car) {
                    setFinitionId(car.id);
                    setSelectedBrand(car.carModel?.brand || null);
                    setSelectedModel(car.carModel || null);
                    
                    const specs = car.technicalSpecs || {};
                    const safety = car.safetyFeatures || {};
                    const comfort = car.comfortFeatures || {};
                    const aesthetic = car.aestheticFeatures || {};
                    const priceHistory = car.priceHistory?.[0] || {};

                    setFormData({
                        ...formData,
                        brandName: car.carModel?.brand?.name || "",
                        modelName: car.carModel?.name || "",
                        category: car.carModel?.category || "SUV",
                        image: car.images?.[0] || car.carModel?.image || "",
                        aiScore: car.carModel?.aiScore?.toString() || "8.0",
                        reliability: car.carModel?.reliability?.toString() || "8.0",
                        maintCost: car.carModel?.maintCost?.toString() || "500",
                        finitionName: car.name,
                        year: car.year?.toString() || "2025",
                        price: car.basePrice?.toString() || "",
                        isPromoted: car.isPromoted || false,
                        promotionalPrice: priceHistory.promotionalPrice?.toString() || "",
                        promoStartDate: priceHistory.startDate ? new Date(priceHistory.startDate).toISOString() : "",
                        promoEndDate: priceHistory.endDate ? new Date(priceHistory.endDate).toISOString() : "",
                        images: car.images && car.images.length > 0 ? [...car.images, ...Array(10 - car.images.length).fill("")] : Array(10).fill(""),
                        youtubeVideo: car.youtubeVideo || "",
                        
                        // Technical Specs
                        energy: specs.fuelType || "Diesel",
                        fiscalPower: specs.fiscalPower?.toString() || "",
                        transmission: specs.transmission || "2 roues motrices ( 4x2 ou 2WD )",
                        cylindree: specs.engineDisplacement?.toString() || "",
                        coupleMax: specs.maxTorque?.toString() || "",
                        power: specs.dinPower?.toString() || "",
                        powerThermique: specs.powerThermique?.toString() || "",
                        powerElec: specs.powerElec?.toString() || "",
                        batteryCapacity: specs.batteryCapacity?.toString() || "",
                        consoCity: specs.consoCity?.toString() || "",
                        consoRoad: specs.consoRoad?.toString() || "",
                        consoMixed: specs.consoMixed?.toString() || "",
                        co2Emission: specs.co2Emission?.toString() || "",
                        maxSpeed: specs.topSpeed?.toString() || "",
                        acceleration: specs.acceleration?.toString() || "",
                        seats: specs.seats?.toString() || "5",
                        weight: specs.weight?.toString() || "",
                        length: specs.length?.toString() || "",
                        width: specs.width?.toString() || "",
                        height: specs.height?.toString() || "",
                        wheelbase: specs.wheelbase?.toString() || "",
                        tankVolume: specs.tankVolume?.toString() || "",
                        trunkVolume: specs.trunkVolume?.toString() || "",
                        // Safety Features (JSON)
                        abs: safety.abs ?? false,
                        esp: safety.esp ?? false,
                        airbags: safety.airbags?.toString() || "8",
                        isofix: safety.isofix ?? false,
                        maintienVoie: safety.laneAssist ?? false,
                        detecteurAngleMort: safety.blindSpotMonitor ?? false,
                        aideFreinageUrgence: safety.emergencyBraking ?? false,
                        detecteurFatigue: safety.fatigueDetection ?? false,
                        detecteurSousGonflage: safety.tirePressureMonitor ?? false,
                        antipatinage: safety.tractionControl ?? false,
                        antidemarrage: safety.immobilizer ?? false,
                        aideDemarrageCote: safety.hillStartAssist ?? false,
                        fermetureAuto: safety.autoDoorLock ?? false,
                        pharesAntibrouillard: safety.fogLights ?? false,
                        alarme: safety.alarm ?? false,
                        reconnaissancePanneaux: safety.trafficSignRecognition ?? false,
                        
                        // Comfort Features (JSON)
                        climatisation: comfort.airConditioning || "Automatique Bi-zone",
                        appleCarplay: comfort.appleCarplay ?? false,
                        androidAuto: comfort.androidAuto ?? false,
                        bluetooth: comfort.bluetooth ?? false,
                        navigationGps: comfort.navigationGps || comfort.navigation || false,
                        radarStationnement: comfort.parkingSensors || "Avant et Arrière",
                        cameraRecul: comfort.rearCamera ?? false,
                        regulateurVitesse: comfort.cruiseControl ?? false,
                        mainsLibres: comfort.keylessEntry ?? false,
                        siegesElectriques: comfort.electricSeats ?? false,
                        cockpitDigital: comfort.digitalCockpit ?? false,
                        systemeAudio: comfort.audioSystem ?? "",
                        ordinateurBord: comfort.onBoardComputer ?? false,
                        startStop: comfort.startStop ?? false,
                        detecteurPluie: comfort.rainSensor ?? false,
                        allumageAutoFeux: comfort.autoHeadlights ?? false,
                        freinMainElectrique: comfort.electricParkingBrake ?? false,
                        ecranTactile: comfort.touchScreen ?? false,
                        affichageTeteHaute: comfort.headUpDisplay ?? false,
                        parkAssist: comfort.parkAssist ?? false,
                        commandesVolant: comfort.steeringWheelControls ?? false,
                        commandesVocales: comfort.voiceCommands ?? false,
                        volantReglable: comfort.adjustableSteeringWheel ?? "",
                        vitresElectriques: comfort.electricWindows ?? "",
                        retrosElectriques: comfort.electricMirrors ?? false,
                        retrosRabattables: comfort.foldingMirrors ?? false,
                        coffreElectrique: comfort.electricTrunk ?? false,
                        siegesMemoire: comfort.memorySeats ?? false,
                        banquetteRabattable: comfort.foldingRearSeats ?? "",
                        wifi: comfort.wifi ?? false,
                        chargeurSansFil: comfort.wirelessCharging ?? false,
                        palettesVolant: comfort.steeringPaddles ?? false,
                        
                        // Aesthetic Features (JSON)
                        jantesAlu: aesthetic.alloyWheels || "17 pouces",
                        volantCuir: aesthetic.leatherSteeringWheel ?? false,
                        lumiereAmbiance: aesthetic.ambientLighting ?? false,
                        vitresSurteintees: aesthetic.tintedWindows ?? false,
                        barresToit: aesthetic.roofRails ?? false,
                        phares: aesthetic.headlights || (aesthetic.ledHeadlights ? "Full LED" : "Halogène"),
                        sellerie: aesthetic.upholstery ?? "",
                        followMeHome: aesthetic.followMeHome ?? false,
                        feuxJour: aesthetic.daytimeRunningLights ?? "",
                        toit: aesthetic.roof ?? "",
                    });
                }
            } catch (error) {
                console.error("Error fetching car:", error);
            } finally {
                setFetching(false);
            }
        }
        fetchData();
    }, [slug]);

    const [uploadingImg, setUploadingImg] = useState<number | null>(null);

    const updateFormData = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImg(index);
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("brand", formData.brandName || "common");
        uploadData.append("model", formData.modelName || "common");
        uploadData.append("year", formData.year || "2025");
        uploadData.append("finition", formData.finitionName || "standard");

        const tempSlug = [formData.brandName, formData.modelName, formData.finitionName, formData.year]
            .filter(Boolean)
            .join("-")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");

        uploadData.append("slug", tempSlug || "unknown");
        uploadData.append("index", index.toString());

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            });
            const data = await res.json();
            if (data.url) {
                const newImages = [...formData.images];
                newImages[index] = data.url;
                updateFormData("images", newImages);
                if (index === 0) updateFormData("image", data.url);
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (error) {
            alert("Error uploading image");
        } finally {
            setUploadingImg(null);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const res = await updateCarStepByStep(finitionId, formData);
        if (res.success) {
            window.location.href = "/admin/cars";
        } else {
            alert("Erreur: " + res.error);
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    const motorFields = [
        { name: "motorisation", label: "Motorisation", type: "text" },
        { name: "emplacement", label: "Emplacement", type: "select", options: ["Avant", "Arrière", "Central"] },
        { name: "energy", label: "Énergie", type: "select", options: ["Essence", "Diesel", "Hybride", "Hybride Rechargeable", "Électrique"] },
        { name: "fiscalPower", label: "Puissance fiscale", type: "number" },
        { name: "transmission", label: "Transmission", type: "select", options: ["Traction", "Propulsion", "4x4", "2 roues motrices ( 4x2 ou 2WD )"] },
        { name: "architecture", label: "Architecture", type: "text" },
        { name: "cylindree", label: "Cylindrée (cm3)", type: "number" },
        { name: "coupleMax", label: "Couple Max (Nm)", type: "number" },
        { name: "gearbox", label: "Boîte à vitesse", type: "select", options: ["Manuelle", "Automatique"] },
        { name: "palettesVolant", label: "Palettes au volant", type: "select", options: ["Oui", "Non"] },
        { name: "power", label: "Puissance cumulée (ch)", type: "number" },
        { name: "powerThermique", label: "Moteur Thermique (ch)", type: "number" },
        { name: "powerElec", label: "Moteur Électrique (kW)", type: "number" },
        { name: "batteryCapacity", label: "Capacité batterie (kWh)", type: "number" },
    ];

    const perfFields = [
        { name: "consoCity", label: "Conso. ville", type: "number" },
        { name: "consoRoad", label: "Conso. route", type: "number" },
        { name: "consoMixed", label: "Conso. mixte", type: "number" },
        { name: "co2Emission", label: "Emission CO2 (g/km)", type: "number" },
        { name: "maxSpeed", label: "Vitesse maxi.", type: "number" },
        { name: "acceleration", label: "Accélération 0-100 km/h", type: "number" },
    ];

    const dimensionFields = [
        { name: "category", label: "Catégorie", type: "select", options: ["SUV", "Berline", "Citadine", "Coupé", "Cabriolet", "Pick-up", "Monospace", "Utilitaire", "Familiale"] },
        { name: "bodyType", label: "Carrosserie", type: "text" },
        { name: "seats", label: "Nombre de places", type: "number" },
        { name: "weight", label: "Poids à vide (kg)", type: "number" },
        { name: "length", label: "Longueur (mm)", type: "number" },
        { name: "width", label: "Largeur (mm)", type: "number" },
        { name: "height", label: "Hauteur (mm)", type: "number" },
        { name: "wheelbase", label: "Empattement (mm)", type: "number" },
        { name: "tankVolume", label: "Volume réservoir (L)", type: "number" },
        { name: "trunkVolume", label: "Volume coffre (L)", type: "number" },
    ];

    const securityFields = [
        { name: "airbags", label: "Airbags", type: "number" },
        { name: "abs", label: "ABS" },
        { name: "esp", label: "ESP" },
        { name: "antipatinage", label: "Antipatinage" },
        { name: "aideFreinageUrgence", label: "Aide au freinage d'urgence" },
        { name: "antidemarrage", label: "Antidémarrage électronique" },
        { name: "aideDemarrageCote", label: "Aide au démarrage en côte" },
        { name: "modeConduite", label: "Sélecteur de mode de conduite" },
        { name: "detecteurFatigue", label: "Détection de fatigue" },
        { name: "maintienVoie", label: "Maintien dans la voie" },
        { name: "detecteurAngleMort", label: "Détecteur d'angle mort" },
        { name: "detecteurSousGonflage", label: "Détecteur de sous-gonflage" },
        { name: "fermetureAuto", label: "Fermeture de portes auto." },
        { name: "isofix", label: "Préparation ISOFIX" },
        { name: "pharesAntibrouillard", label: "Phares antibrouillard" },
        { name: "alarme", label: "Système d'alarme" },
    ];

    const comfortFields = [
        { name: "climatisation", label: "Climatisation", type: "select", options: ["Aucune", "Manuelle", "Automatique", "Bi-zone", "Tri-zone", "Quadri-zone"] },
        { name: "systemeAudio", label: "Système audio", type: "text" },
        { name: "ordinateurBord", label: "Ordinateur de bord" },
        { name: "startStop", label: "Start & Stop" },
        { name: "regulateurVitesse", label: "Régulateur de vitesse" },
        { name: "detecteurPluie", label: "Détecteur de pluie" },
        { name: "allumageAutoFeux", label: "Allumage auto. des feux" },
        { name: "freinMainElectrique", label: "Frein à main électrique" },
        { name: "ecranTactile", label: "Ecran tactile" },
        { name: "cockpitDigital", label: "Cockpit digital" },
        { name: "reconnaissancePanneaux", label: "Reconnaissance de panneaux" },
        { name: "affichageTeteHaute", label: "Affichage Tête-Haute" },
        { name: "radarStationnement", label: "Aide au stationnement", type: "select", options: ["Aucun", "Arrière", "Avant et Arrière", "360°"] },
        { name: "cameraRecul", label: "Caméra de recul" },
        { name: "parkAssist", label: "Park Assist Auto." },
        { name: "commandesVolant", label: "Commandes au volant" },
        { name: "commandesVocales", label: "Commandes vocales" },
        { name: "volantReglable", label: "Volant réglable", type: "text" },
        { name: "vitresElectriques", label: "Vitres électriques", type: "text" },
        { name: "retrosElectriques", label: "Rétros. électriques" },
        { name: "retrosRabattables", label: "Rétros. rabattables électriques" },
        { name: "coffreElectrique", label: "Coffre électrique" },
        { name: "mainsLibres", label: "Mains libres (Démarrage)" },
        { name: "siegesElectriques", label: "Sièges électriques" },
        { name: "siegesMemoire", label: "Sièges élec. avec mémoire" },
        { name: "banquetteRabattable", label: "Banquette arrière rabattable", type: "text" },
        { name: "navigationGps", label: "Navigation GPS" },
        { name: "wifi", label: "WiFi à bord" },
        { name: "bluetooth", label: "Bluetooth" },
        { name: "appleCarplay", label: "Compatibilité smartphone" },
        { name: "chargeurSansFil", label: "Chargeur/mobile sans fil" },
    ];

    const aestheticFields = [
        { name: "jantesAlu", label: "Jantes aluminium", type: "text" },
        { name: "sellerie", label: "Sellerie", type: "text" },
        { name: "volantCuir", label: "Volant cuir" },
        { name: "followMeHome", label: "Follow-me home" },
        { name: "lumiereAmbiance", label: "Lumière d'ambiance" },
        { name: "feuxJour", label: "Feux de jour", type: "text" },
        { name: "phares", label: "Phares", type: "text" },
        { name: "toit", label: "Toit", type: "text" },
        { name: "barresToit", label: "Barres de toit" },
        { name: "vitresSurteintees", label: "Vitres sur-teintées" },
    ];

    const booleanFields = [
        ...securityFields.filter(f => !f.type).map(f => ({ ...f, category: "Sécurité" })),
        ...comfortFields.filter(f => !f.type).map(f => ({ ...f, category: "Confort" })),
        ...aestheticFields.filter(f => !f.type).map(f => ({ ...f, category: "Esthétique" }))
    ];

    const selectFields = [
        ...dimensionFields.filter(f => f.type === "select").map(f => ({ ...f })),
        ...comfortFields.filter(f => f.type === "select").map(f => ({ ...f }))
    ];

    const otherStringFields = [
        { name: "jantesAlu", label: "Jantes aluminium" },
        { name: "sellerie", label: "Sellerie" },
        { name: "feuxJour", label: "Feux de jour" },
        { name: "phares", label: "Phares" },
        { name: "toit", label: "Toit" },
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-zinc-900 font-sans pb-20">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/admin/cars" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold">Retour aux réglages</span>
                        </Link>
                        <h1 className="text-xl font-black uppercase tracking-widest text-zinc-400">Modifier le véhicule</h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 pt-12 space-y-12">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="px-4 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            {formData.brandName}
                        </span>
                        <span className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            {formData.modelName}
                        </span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight mb-4">Edition : {formData.finitionName}</h2>
                </div>

                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Camera className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-2xl font-black tracking-tight">Médiathèque</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {formData.images.map((img: string, index: number) => (
                            <div key={index} className="space-y-2">
                                <label className={`aspect-square rounded-2xl bg-zinc-50 border-2 border-dashed overflow-hidden relative group transition-all flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 ${index === 0 ? "border-indigo-500/20" : "border-zinc-200"}`}>
                                    {uploadingImg === index ? (
                                        <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    ) : img ? (
                                        <>
                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                            {index === 0 && <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-500 text-white text-[8px] font-black rounded-lg">PRINCIPALE</div>}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-zinc-300 group-hover:text-indigo-500 transition-colors">
                                            <Plus className="w-6 h-6" />
                                            <span className="text-[8px] font-black uppercase">Upload</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, index)} accept="image/*" />
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Lien Vidéo YouTube</label>
                        <input
                            value={formData.youtubeVideo}
                            onChange={(e) => updateFormData("youtubeVideo", e.target.value)}
                            placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                        />
                    </div>
                </section>

                {/* Infos de base */}
                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Informations de base</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Finition <span className="text-red-500">*</span></label>
                            <input value={formData.finitionName} onChange={(e) => updateFormData("finitionName", e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Année <span className="text-red-500">*</span></label>
                            <input type="number" value={formData.year} onChange={(e) => updateFormData("year", e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Prix (DH) <span className="text-red-500">*</span></label>
                            <input type="number" value={formData.price} onChange={(e) => updateFormData("price", e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black" />
                        </div>
                    </div>
                </section>

                {/* Promotions & Pricing */}
                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Promotions & Tarification</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-zinc-50 rounded-2xl gap-4 border border-zinc-100">
                            <div>
                                <h3 className="font-bold text-zinc-900 text-lg">Activer une promotion "À la une"</h3>
                                <p className="text-xs text-zinc-500 font-medium mt-1">Permet de mettre le véhicule en évidence avec un prix barré sur le site.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => updateFormData("isPromoted", !formData.isPromoted)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors relative inline-flex items-center flex-shrink-0 ${formData.isPromoted ? "bg-emerald-500" : "bg-zinc-200"}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${formData.isPromoted ? "translate-x-6" : "translate-x-0"}`} />
                            </button>
                        </div>

                        {formData.isPromoted && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 border border-emerald-100 bg-emerald-50/30 rounded-2xl">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800 block ml-2">Prix promotionnel (DH) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={formData.promotionalPrice || ""}
                                        onChange={(e) => updateFormData("promotionalPrice", e.target.value)}
                                        placeholder="Nouveau prix..."
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-emerald-100 focus:ring-2 focus:ring-emerald-500/20 font-black text-emerald-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block ml-2">Date de début</label>
                                    <input
                                        type="date"
                                        value={formData.promoStartDate ? formData.promoStartDate.split('T')[0] : ""}
                                        onChange={(e) => updateFormData("promoStartDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-100 focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block ml-2">Date de fin</label>
                                    <input
                                        type="date"
                                        value={formData.promoEndDate ? formData.promoEndDate.split('T')[0] : ""}
                                        onChange={(e) => updateFormData("promoEndDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-zinc-100 focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-black tracking-tight">Moteur & Performances</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[...motorFields, ...perfFields].map((field: any) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                {field.type === "select" ? (
                                    <select value={formData[field.name]} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm appearance-none cursor-pointer">
                                        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type === "number" ? "number" : "text"}
                                        value={formData[field.name] || ""}
                                        onChange={(e) => updateFormData(field.name, e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Plus className="w-6 h-6 text-zinc-400" />
                        <h2 className="text-2xl font-black tracking-tight">Dimensions & Volumes</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {dimensionFields.map((field: any) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                {field.type === "select" ? (
                                    <select value={formData[field.name]} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm appearance-none cursor-pointer">
                                        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type="number" value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sécurité */}
                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Sécurité</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 border-b border-zinc-50 pb-10">
                        {securityFields.filter(f => f.type === "number").map((field: any) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                <input type="number" value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                        {securityFields.filter(f => !f.type).map((field: any) => (
                            <div key={field.name} className="flex items-center justify-between py-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 px-4 -mx-4 rounded-xl transition-colors">
                                <span className="font-bold text-zinc-700">{field.label}</span>
                                <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
                                    <button onClick={() => updateFormData(field.name, true)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === true ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "text-zinc-400 hover:text-zinc-600"}`}>OUI</button>
                                    <button onClick={() => updateFormData(field.name, false)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === false ? "bg-zinc-800 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"}`}>NON</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Confort */}
                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Confort</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-b border-zinc-50 pb-10">
                        {comfortFields.filter(f => f.type === "select" || f.type === "text").map((field: any) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                {field.type === "select" ? (
                                    <select value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm appearance-none cursor-pointer">
                                        <option value="">Sélectionner...</option>
                                        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-pink-500/20 font-bold text-sm" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                        {comfortFields.filter(f => !f.type).map((field: any) => (
                            <div key={field.name} className="flex items-center justify-between py-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 px-4 -mx-4 rounded-xl transition-colors">
                                <span className="font-bold text-zinc-700">{field.label}</span>
                                <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
                                    <button onClick={() => updateFormData(field.name, true)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === true ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "text-zinc-400 hover:text-zinc-600"}`}>OUI</button>
                                    <button onClick={() => updateFormData(field.name, false)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === false ? "bg-zinc-800 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"}`}>NON</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Esthétique */}
                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Esthétique</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-b border-zinc-50 pb-10">
                        {aestheticFields.filter(f => f.type === "text").map((field: any) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                <input type="text" value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                        {aestheticFields.filter(f => !f.type).map((field: any) => (
                            <div key={field.name} className="flex items-center justify-between py-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 px-4 -mx-4 rounded-xl transition-colors">
                                <span className="font-bold text-zinc-700">{field.label}</span>
                                <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
                                    <button onClick={() => updateFormData(field.name, true)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === true ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "text-zinc-400 hover:text-zinc-600"}`}>OUI</button>
                                    <button onClick={() => updateFormData(field.name, false)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === false ? "bg-zinc-800 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"}`}>NON</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-16 py-6 rounded-3xl bg-zinc-900 text-white font-black uppercase tracking-widest text-sm hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-zinc-200 flex items-center gap-4"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                        Sauvegarder les modifications
                    </button>
                </div>
            </main>
        </div>
    );
}
