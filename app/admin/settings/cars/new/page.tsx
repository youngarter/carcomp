"use client";

import React, { useState, useEffect } from "react";
import {
    Car, ArrowLeft, Camera, Sparkles,
    Settings, Zap, Shield, Heart, Save, Check, ChevronRight, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    createCarStepByStep,
    getBrands,
    getModelsByBrand,
    getFinitionsByModel
} from "../../../../car/actions";

export default function NewCarPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data lists
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [finitions, setFinitions] = useState<any[]>([]);

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
        isPromoted: false,
        promotionalPrice: "",
        promoStartDate: "",
        promoEndDate: "",
        images: ["", "", "", "", "", "", "", "", "", ""], // Media library (max 10)
        youtubeVideo: "",
        // Moteur & Infos techniques
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
        // Conso & Perf
        consoCity: "",
        consoRoad: "",
        consoMixed: "",
        co2Emission: "",
        maxSpeed: "",
        acceleration: "",
        // Dimensions
        bodyType: "",
        seats: "5",
        weight: "",
        length: "",
        width: "",
        height: "",
        wheelbase: "",
        tankVolume: "",
        trunkVolume: "",
        // Sécurité (Booleans)
        airbags: "8",
        abs: true, esp: true, antipatinage: true, aideFreinageUrgence: true,
        antidemarrage: true, aideDemarrageCote: true, modeConduite: true,
        detecteurFatigue: true, maintienVoie: true, detecteurAngleMort: true,
        detecteurSousGonflage: true, fermetureAuto: true, isofix: true,
        pharesAntibrouillard: true, alarme: true,
        // Confort (Booleans & Selects)
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
        // Esthétique
        jantesAlu: "17 pouces",
        sellerie: "Similicuir",
        volantCuir: true, followMeHome: true, lumiereAmbiance: true,
        feuxJour: "LED", phares: "Full LED", toit: "Rigide",
        barresToit: false, vitresSurteintees: true,
    });

    useEffect(() => {
        async function init() {
            const b = await getBrands();
            setBrands(b);
        }
        init();
    }, []);

    const handleBrandSelect = async (brand: any) => {
        setSelectedBrand(brand);
        // Clear previous model/finition data when brand changes
        setFormData({
            ...formData,
            brandName: brand.name,
            brandId: brand.id,
            modelName: "",
            modelId: "",
            finitionName: "",
            finitionId: ""
        });
        const m = await getModelsByBrand(brand.id);
        setModels(m);
        setStep(2);
    };

    const handleModelSelect = async (model: any) => {
        setSelectedModel(model);
        setFormData({
            ...formData,
            modelName: model.name,
            modelId: model.id,
            category: model.category,
            image: model.image,
            aiScore: model.aiScore,
            reliability: model.reliability,
            maintCost: model.maintCost,
            // Clear previous finition
            finitionName: "",
            finitionId: ""
        });
        const f = await getFinitionsByModel(model.id);
        setFinitions(f);
        setStep(3);
    };

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

        // Generate a temporary slug for the folder path if brand/model/finition/year are selected
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
        // Validation labels for better error messages
        const requiredFields: any = {
            brandName: "Marque",
            modelName: "Modèle",
            finitionName: "Finition",
            year: "Année",
            price: "Prix",
        };

        for (const [key, label] of Object.entries(requiredFields)) {
            if (!formData[key]) {
                alert(`Le champ "${label}" est obligatoire.`);
                setLoading(false);
                return;
            }
        }

        if (formData.images.filter((img: string) => img !== "").length === 0) {
            alert("Veuillez ajouter au moins une image dans la médiathèque.");
            return;
        }

        setLoading(true);

        const res = await createCarStepByStep(formData);
        if (res.success) {
            window.location.href = "/admin/settings/cars";
        } else {
            alert("Erreur: " + res.error);
            setLoading(false);
        }
    };

    // Schema groups for Step 3
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

    const carCategories = ["SUV", "Berline", "Citadine", "Coupé", "Cabriolet", "Pick-up", "Monospace", "Utilitaire", "Familiale"];

    const techFields = motorFields;

    const booleanFields = [
        ...securityFields.filter(f => !f.type).map(f => ({ ...f, category: "Sécurité" })),
        ...comfortFields.filter(f => !f.type).map(f => ({ ...f, category: "Confort" })),
        ...aestheticFields.filter(f => !f.type).map(f => ({ ...f, category: "Esthétique" }))
    ];

    const selectFields = [
        ...motorFields.filter(f => f.type === "select").map(f => ({ ...f, step: 3 })),
        ...dimensionFields.filter(f => f.type === "select").map(f => ({ ...f, step: 3 })),
        ...comfortFields.filter(f => f.type === "select").map(f => ({ ...f, step: 3 }))
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
            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => step > 1 ? setStep(step - 1) : window.history.back()}
                                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold">Retour</span>
                            </button>
                            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
                            <div className="flex items-center gap-3">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step >= s ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-zinc-100 text-zinc-400"}`}>
                                            {step > s ? <Check className="w-4 h-4" /> : s}
                                        </div>
                                        {s < 3 && <div className={`w-4 h-0.5 rounded-full ${step > s ? "bg-emerald-600" : "bg-zinc-100"}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">
                                Étape {step === 1 ? "Marque" : step === 2 ? "Modèle" : "Finition"}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 pt-12">
                <AnimatePresence mode="wait">

                    {/* STEP 1: BRAND */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-black tracking-tight mb-4">Quelle est la marque du véhicule ?</h1>
                                <p className="text-zinc-500 font-medium italic">Sélectionnez une marque existante ou créez-en une nouvelle.</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {brands.map((b) => (
                                    <button
                                        key={b.id}
                                        onClick={() => handleBrandSelect(b)}
                                        className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all group flex flex-col items-center gap-4"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-emerald-600 transition-colors">
                                            <Car className="w-8 h-8" />
                                        </div>
                                        <span className="font-black text-sm uppercase tracking-wider">{b.name}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        setSelectedBrand(null);
                                        setFormData({
                                            ...formData,
                                            brandName: "",
                                            brandId: "",
                                            modelName: "",
                                            modelId: "",
                                            finitionName: "",
                                            finitionId: ""
                                        });
                                        setStep(2);
                                    }}
                                    className="p-8 bg-zinc-900 rounded-3xl text-white shadow-xl hover:bg-zinc-800 transition-all flex flex-col items-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="font-black text-sm uppercase tracking-wider">Nouvelle Marque</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: MODEL */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-12">
                                <span className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
                                    {selectedBrand ? selectedBrand.name : "Nouvelle Marque"}
                                </span>
                                <h1 className="text-4xl font-black tracking-tight mb-4">Choisissez ou créez le modèle</h1>
                            </div>

                            {!selectedBrand && (
                                <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm mb-8">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-4 ml-2">Nom de la Marque <span className="text-red-500">*</span></label>
                                    <input
                                        value={formData.brandName}
                                        onChange={(e) => updateFormData("brandName", e.target.value)}
                                        placeholder="Ex: Tesla, Ferrari, BYD..."
                                        className="w-full px-8 py-6 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black text-xl"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedBrand && models.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => handleModelSelect(m)}
                                        className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                                                <Car className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="font-black text-lg block">{m.name}</span>
                                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">{m.category}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                                    </button>
                                ))}

                                <div className="bg-zinc-900 p-8 rounded-[40px] text-white shadow-xl flex flex-col gap-8">
                                    <div className="flex items-center gap-4">
                                        <Plus className="w-8 h-8 text-emerald-500" />
                                        <h2 className="text-2xl font-black tracking-tight">Nouveau Modèle</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nom du Modèle <span className="text-red-500">*</span></label>
                                            <input
                                                value={formData.modelName}
                                                onChange={(e) => {
                                                    setSelectedModel(null);
                                                    setFormData({ ...formData, modelName: e.target.value, modelId: "" });
                                                }}
                                                placeholder="Ex: Model 3, Cayenne..."
                                                className="w-full px-6 py-4 rounded-2xl bg-white/10 border-none focus:ring-2 focus:ring-emerald-500/50 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Catégorie</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => updateFormData("category", e.target.value)}
                                                className="w-full px-6 py-4 rounded-2xl bg-white/10 border-none focus:ring-2 focus:ring-emerald-500/50 font-bold text-white appearance-none cursor-pointer"
                                            >
                                                {carCategories.map(cat => (
                                                    <option key={cat} value={cat} className="text-zinc-900">{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">URL Image</label>
                                            <input
                                                value={formData.image}
                                                onChange={(e) => updateFormData("image", e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-6 py-4 rounded-2xl bg-white/10 border-none focus:ring-2 focus:ring-emerald-500/50 font-bold"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setStep(3)}
                                            disabled={!formData.modelName}
                                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: FINITION & OPTIONS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className="px-4 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {formData.brandName}
                                    </span>
                                    <span className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {formData.modelName}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight mb-4">Détails de la Finition</h1>
                                <p className="text-zinc-500 font-medium italic">Configurez les options et caractéristiques techniques.</p>
                            </div>

                            {/* Media Library - MOVED TO TOP */}
                            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <Camera className="w-6 h-6 text-indigo-500" />
                                    <h2 className="text-2xl font-black tracking-tight">Médiathèque</h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Images de la finition (Max 10) <span className="text-red-500">*</span></label>
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">L'image 1 est l'image principale par défaut</span>
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
                                                                {index === 0 && (
                                                                    <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-500 text-white text-[8px] font-black rounded-lg shadow-lg">
                                                                        PRINCIPALE
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-zinc-300 group-hover:text-indigo-500 transition-colors">
                                                                <Plus className="w-6 h-6" />
                                                                <span className="text-[8px] font-black uppercase">Upload</span>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            onChange={(e) => handleFileUpload(e, index)}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <div className="text-[8px] font-black text-zinc-400 text-center uppercase tracking-widest line-clamp-1">
                                                        {img ? img.split("/").pop() : `Image ${index + 1}`}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Lien Vidéo YouTube</label>
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <input
                                                        value={formData.youtubeVideo}
                                                        onChange={(e) => updateFormData("youtubeVideo", e.target.value)}
                                                        placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                                        className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                                                    />
                                                    {formData.youtubeVideo && (
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                            <Check className="w-5 h-5 text-emerald-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-[10px] font-medium text-zinc-400 italic">Collez l'URL complète ou l'ID de la vidéo.</p>
                                            </div>
                                            {formData.youtubeVideo && (
                                                <div className="w-full md:w-64 aspect-video rounded-2xl bg-black overflow-hidden shadow-2xl ring-4 ring-indigo-500/10">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${formData.youtubeVideo.includes("v=") ? formData.youtubeVideo.split("v=")[1]?.split("&")[0] : formData.youtubeVideo.split("/").pop()}`}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Basic Info */}
                            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Nom de la version / finition <span className="text-red-500">*</span></label>
                                        <input
                                            value={formData.finitionName}
                                            onChange={(e) => updateFormData("finitionName", e.target.value)}
                                            placeholder="Ex: GT Line, Premium Edition..."
                                            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Année de sortie <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={formData.year}
                                            onChange={(e) => updateFormData("year", e.target.value)}
                                            placeholder="2025"
                                            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Prix (DH) <span className="text-red-500">*</span></label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => updateFormData("price", e.target.value)}
                                            placeholder="350000"
                                            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-black"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Promotions & Pricing */}
                            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-black tracking-tight">Promotions & Tarification</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-zinc-50 rounded-2xl gap-4 border border-zinc-100">
                                        <div>
                                            <h3 className="font-bold text-zinc-900">Activer une promotion "À la une"</h3>
                                            <p className="text-xs text-zinc-500 font-medium mt-1">Permet de mettre le véhicule en évidence avec un prix barré.</p>
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

                            {/* Technical Inputs */}
                            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <Zap className="w-6 h-6 text-yellow-500" />
                                    <h2 className="text-2xl font-black tracking-tight">Moteur & Performances</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {[...techFields, ...perfFields].map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => updateFormData(field.name, e.target.value)}
                                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Dimensions */}
                            <section className="bg-white p-8 md:p-12 rounded-[40px] border border-black/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Dimensions & Volumes</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {dimensionFields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                            <input
                                                type={field.type}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => updateFormData(field.name, e.target.value)}
                                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Options (Booleans as Radio Buttons) */}
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
                                                <button
                                                    type="button"
                                                    onClick={() => updateFormData(field.name, true)}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === true ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "text-zinc-400 hover:text-zinc-600"}`}
                                                >
                                                    OUI
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateFormData(field.name, false)}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${formData[field.name] === false ? "bg-zinc-800 text-white shadow-md shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"}`}
                                                >
                                                    NON
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectFields.filter(f => f.step === 3).map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                            <select
                                                value={formData[field.name] || ""}
                                                onChange={(e) => updateFormData(field.name, e.target.value)}
                                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="">Sélectionner...</option>
                                                {field.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Système Audio</label>
                                        <input
                                            type="text"
                                            value={formData.systemeAudio || ""}
                                            onChange={(e) => updateFormData("systemeAudio", e.target.value)}
                                            placeholder="Ex: Bose, Harman Kardon..."
                                            className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                        />
                                    </div>
                                    {otherStringFields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">{field.label}</label>
                                            <input
                                                type="text"
                                                value={formData[field.name] || ""}
                                                onChange={(e) => updateFormData(field.name, e.target.value)}
                                                placeholder={`Détails ${field.label.toLowerCase()}...`}
                                                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-8 py-5 rounded-3xl font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        loading ||
                                        !formData.brandName ||
                                        !formData.modelName ||
                                        !formData.finitionName ||
                                        !formData.year ||
                                        !formData.price ||
                                        formData.images.filter((img: string) => img !== "").length === 0
                                    }
                                    className="px-12 py-5 rounded-3xl bg-zinc-900 text-white font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50 flex items-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Finaliser la création
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
