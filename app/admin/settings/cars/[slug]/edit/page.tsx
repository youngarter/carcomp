"use client";

import React, { useState, useEffect, use } from "react";
import {
    Car, ArrowLeft, Camera, Sparkles,
    Settings, Zap, Shield, Heart, Save, Check, ChevronRight, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    updateCarStepByStep,
    getFinitionBySlug,
    getBrands,
    getModelsByBrand
} from "../../../../../car/actions";

export default function EditCarPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [finitionId, setFinitionId] = useState("");

    // Selection State
    const [selectedBrand, setSelectedBrand] = useState<any>(null);
    const [selectedModel, setSelectedModel] = useState<any>(null);

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
                const car = await getFinitionBySlug(slug);
                if (car) {
                    setFinitionId(car.id);
                    setFormData({
                        ...formData,
                        brandName: car.carModel.brand.name,
                        modelName: car.carModel.name,
                        category: car.carModel.category,
                        image: car.image || car.carModel.image,
                        aiScore: car.carModel.aiScore?.toString() || "8.0",
                        reliability: car.carModel.reliability?.toString() || "8.0",
                        maintCost: car.carModel.maintCost?.toString() || "500",
                        finitionName: car.name,
                        year: car.year?.toString() || "2025",
                        price: car.price?.toString() || "",
                        images: car.images && car.images.length > 0 ? [...car.images, ...Array(10 - car.images.length).fill("")] : Array(10).fill(""),
                        youtubeVideo: car.youtubeVideo || "",
                        motorisation: car.motorisation || "",
                        emplacement: car.emplacement || "Avant",
                        energy: car.energy || "Diesel",
                        fiscalPower: car.fiscalPower?.toString() || "",
                        transmission: car.transmission || "2 roues motrices ( 4x2 ou 2WD )",
                        architecture: car.architecture || "",
                        cylindree: car.cylindree?.toString() || "",
                        coupleMax: car.coupleMax?.toString() || "",
                        gearbox: car.gearbox || "Automatique",
                        palettesVolant: car.palettesVolant || "Non",
                        power: car.power?.toString() || "",
                        powerThermique: car.powerThermique?.toString() || "",
                        powerElec: car.powerElec?.toString() || "",
                        batteryCapacity: car.batteryCapacity?.toString() || "",
                        consoCity: car.consoCity?.toString() || "",
                        consoRoad: car.consoRoad?.toString() || "",
                        consoMixed: car.consoMixed?.toString() || "",
                        co2Emission: car.co2Emission?.toString() || "",
                        maxSpeed: car.maxSpeed?.toString() || "",
                        acceleration: car.acceleration?.toString() || "",
                        bodyType: car.bodyType || "",
                        seats: car.seats?.toString() || "5",
                        weight: car.weight?.toString() || "",
                        length: car.length?.toString() || "",
                        width: car.width?.toString() || "",
                        height: car.height?.toString() || "",
                        wheelbase: car.wheelbase?.toString() || "",
                        tankVolume: car.tankVolume?.toString() || "",
                        trunkVolume: car.trunkVolume?.toString() || "",
                        // Booleans
                        abs: car.abs ?? true,
                        esp: car.esp ?? true,
                        antipatinage: car.antipatinage ?? true,
                        aideFreinageUrgence: car.aideFreinageUrgence ?? true,
                        antidemarrage: car.antidemarrage ?? true,
                        aideDemarrageCote: car.aideDemarrageCote ?? true,
                        modeConduite: car.modeConduite ?? true,
                        detecteurFatigue: car.detecteurFatigue ?? true,
                        maintienVoie: car.maintienVoie ?? true,
                        detecteurAngleMort: car.detecteurAngleMort ?? true,
                        detecteurSousGonflage: car.detecteurSousGonflage ?? true,
                        fermetureAuto: car.fermetureAuto ?? true,
                        isofix: car.isofix ?? true,
                        pharesAntibrouillard: car.pharesAntibrouillard ?? true,
                        alarme: car.alarme ?? true,
                        ordinateurBord: car.ordinateurBord ?? true,
                        startStop: car.startStop ?? true,
                        regulateurVitesse: car.regulateurVitesse ?? true,
                        detecteurPluie: car.detecteurPluie ?? true,
                        allumageAutoFeux: car.allumageAutoFeux ?? true,
                        freinMainElectrique: car.freinMainElectrique ?? true,
                        ecranTactile: car.ecranTactile ?? true,
                        cockpitDigital: car.cockpitDigital ?? true,
                        reconnaissancePanneaux: car.reconnaissancePanneaux ?? true,
                        affichageTeteHaute: car.affichageTeteHaute ?? true,
                        cameraRecul: car.cameraRecul ?? true,
                        parkAssist: car.parkAssist ?? true,
                        commandesVolant: car.commandesVolant ?? true,
                        commandesVocales: car.commandesVocales ?? true,
                        retrosElectriques: car.retrosElectriques ?? true,
                        retrosRabattables: car.retrosRabattables ?? true,
                        coffreElectrique: car.coffreElectrique ?? true,
                        mainsLibres: car.mainsLibres ?? true,
                        siegesElectriques: car.siegesElectriques ?? true,
                        siegesMemoire: car.siegesMemoire ?? true,
                        navigationGps: car.navigationGps ?? true,
                        wifi: car.wifi ?? true,
                        bluetooth: car.bluetooth ?? true,
                        appleCarplay: car.appleCarplay ?? true,
                        chargeurSansFil: car.chargeurSansFil ?? true,
                        volantCuir: car.volantCuir ?? true,
                        followMeHome: car.followMeHome ?? true,
                        lumiereAmbiance: car.lumiereAmbiance ?? true,
                        barresToit: car.barresToit ?? false,
                        vitresSurteintees: car.vitresSurteintees ?? true,
                        // Selects/Strings
                        climatisation: car.climatisation || "Automatique Bi-zone",
                        systemeAudio: car.systemeAudio || "Radio, USB",
                        radarStationnement: car.radarStationnement || "Avant et Arrière",
                        volantReglable: car.volantReglable || "Hauteur et Profondeur",
                        vitresElectriques: car.vitresElectriques || "Electrique AV/AR",
                        banquetteRabattable: car.banquetteRabattable || "1/3-2/3",
                        jantesAlu: car.jantesAlu || "17 pouces",
                        sellerie: car.sellerie || "Similicuir",
                        feuxJour: car.feuxJour || "LED",
                        phares: car.phares || "Full LED",
                        toit: car.toit || "Rigide",
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
            window.location.href = "/admin/settings/cars";
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
        ...motorFields.filter(f => f.type === "select").map(f => ({ ...f })),
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
                        <Link href="/admin/settings/cars" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group">
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

                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
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

                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-2xl font-black tracking-tight">Moteur & Performances</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[...motorFields, ...perfFields].map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                <input
                                    type={field.type === "number" ? "number" : "text"}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => updateFormData(field.name, e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                />
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
                        {dimensionFields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                {field.type === "select" ? (
                                    <select value={formData[field.name]} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm appearance-none cursor-pointer">
                                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input type="number" value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <Shield className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-2xl font-black tracking-tight">Équipements & Options</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 mb-12">
                        {booleanFields.map((field) => (
                            <div key={field.name} className="flex items-center justify-between py-4 border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 px-4 -mx-4 rounded-xl transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-bold text-zinc-700">{field.label}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{field.category}</span>
                                </div>
                                <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
                                    <button onClick={() => updateFormData(field.name, true)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === true ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "text-zinc-400 hover:text-zinc-600"}`}>OUI</button>
                                    <button onClick={() => updateFormData(field.name, false)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === false ? "bg-zinc-800 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"}`}>NON</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectFields.filter(f => f.type === "select").map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                <select value={formData[field.name] || ""} onChange={(e) => updateFormData(field.name, e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm appearance-none cursor-pointer">
                                    <option value="">Sélectionner...</option>
                                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end pt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-16 py-6 rounded-3xl bg-zinc-900 text-white font-black uppercase tracking-widest text-sm hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 flex items-center gap-4"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                        Sauvegarder les modifications
                    </button>
                </div>
            </main>
        </div>
    );
}
