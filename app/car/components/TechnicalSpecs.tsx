"use client";
import React from "react";
import { Zap, Settings, Ruler, ShieldCheck, Car as CarIcon, Monitor } from "lucide-react";
import type { Specs } from "../../../types/car";

interface TechnicalSpecsProps {
    specs: Specs;
}

const SpecItem = ({ label, value, isLast = false }: { label: string, value: string | number | null | undefined, isLast?: boolean }) => {
    return (
        <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b border-zinc-100/50' : ''}`}>
            <span className="text-zinc-500 font-medium">{label}</span>
            <span className="text-zinc-900 font-bold">{value !== null && value !== undefined && value !== '' ? value : "Non disponible"}</span>
        </div>
    );
};

const FeatureBadge = ({ label, available }: { label: string, available: boolean | null | undefined }) => {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${available ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-zinc-50 border-zinc-100/50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${available ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-400'}`}>
                {available ? <span className="text-xs font-bold">✓</span> : <span className="text-xs font-bold">✕</span>}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900">{label}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${available ? 'text-emerald-500' : 'text-zinc-400'}`}>
                    {available ? "Disponible" : "Non disponible"}
                </span>
            </div>
        </div>
    );
};

const OptionBadge = ({ label, value }: { label: string, value: boolean | string | null | undefined }) => {
    let isAvailable = false;
    if (typeof value === 'boolean') {
        isAvailable = value;
    } else if (typeof value === 'string' && value.trim() !== '') {
        isAvailable = true;
    }

    return (
        <div className={`flex items-center gap-3 p-3 rounded-2xl border ${isAvailable ? 'bg-emerald-50/30 border-emerald-100/30' : 'bg-zinc-50 border-zinc-100/50'}`}>
            <div className={`min-w-6 w-6 h-6 rounded-full flex items-center justify-center ${isAvailable ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-400'}`}>
                {isAvailable ? <span className="text-xs font-bold">✓</span> : <span className="text-xs font-bold">✕</span>}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-zinc-900 truncate">{label}</span>
                {typeof value === 'string' && value.trim() !== '' ? (
                    <span className="text-[10px] text-zinc-500 font-medium truncate">{value}</span>
                ) : (
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isAvailable ? 'text-emerald-500' : 'text-zinc-400'}`}>
                        {isAvailable ? "Disponible" : "Non disponible"}
                    </span>
                )}
            </div>
        </div>
    );
};


const TechnicalSpecs = ({ specs }: TechnicalSpecsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ENGINE */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" /> Moteur
                </h3>
                <SpecItem label="Energie" value={specs.moteur?.energie} />
                <SpecItem label="Motorisation" value={specs.moteur?.motorisation} />
                <SpecItem label="Puissance dynamique" value={specs.moteur?.puissanceDynamique} />
                <SpecItem label="Cylindrée" value={specs.moteur?.cylindree ? `${specs.moteur.cylindree} cm³` : null} />
                <SpecItem label="Couple max" value={specs.moteur?.coupleMax ? `${specs.moteur.coupleMax} Nm` : null} />
                <SpecItem label="Transmission" value={specs.moteur?.transmission} />
                <SpecItem label="Boîte de vitesse" value={specs.moteur?.boiteAVitesse} />
                <SpecItem label="Puissance fiscale" value={specs.moteur?.puissanceFiscale ? `${specs.moteur.puissanceFiscale} CV` : null} />
                <SpecItem label="Emplacement moteur" value={specs.moteur?.emplacementMoteur} />
                <SpecItem label="Palettes au volant" value={specs.moteur?.palettesVolant} />
                <SpecItem label="Puissance thermique" value={specs.moteur?.puissanceThermique ? `${specs.moteur.puissanceThermique} ch` : null} />
                <SpecItem label="Puissance électrique" value={specs.moteur?.puissanceElectrique ? `${specs.moteur.puissanceElectrique} kW` : null} />
                <SpecItem label="Capacité batterie" value={specs.moteur?.capaciteBatterie ? `${specs.moteur.capaciteBatterie} kWh` : null} isLast />
            </div>

            {/* PERFORMANCE */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-500" /> Consommation & performances
                </h3>
                <SpecItem label="Conso. Mixte" value={specs.consoPerformances?.consoMixte ? `${specs.consoPerformances.consoMixte} L/100km` : null} />
                <SpecItem label="Conso. Ville" value={specs.consoPerformances?.consoVille ? `${specs.consoPerformances.consoVille} L/100km` : null} />
                <SpecItem label="Conso. Route" value={specs.consoPerformances?.consoRoute ? `${specs.consoPerformances.consoRoute} L/100km` : null} />
                <SpecItem label="Emission CO2" value={specs.consoPerformances?.co2Emission ? `${specs.consoPerformances.co2Emission} g/km` : null} />
                <SpecItem label="Vitesse Max" value={specs.consoPerformances?.vitesseMax} />
                <SpecItem label="Accélération (0-100 km/h)" value={specs.consoPerformances?.acceleration} isLast />
            </div>

            {/* DIMENSIONS */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-purple-500" /> Dimensions
                </h3>
                <SpecItem label="Places" value={specs.dimensions?.places} />
                <SpecItem label="Volume coffre" value={specs.dimensions?.volumeCoffre ? `${specs.dimensions.volumeCoffre} L` : null} />
                <SpecItem label="Volume réservoir" value={specs.dimensions?.volumeReservoir ? `${specs.dimensions.volumeReservoir} L` : null} />
                <SpecItem label="Poids à vide" value={specs.dimensions?.poids ? `${specs.dimensions.poids} kg` : null} />
                <SpecItem label="Longueur" value={specs.dimensions?.longueur ? `${specs.dimensions.longueur} mm` : null} />
                <SpecItem label="Largeur" value={specs.dimensions?.largeur ? `${specs.dimensions.largeur} mm` : null} />
                <SpecItem label="Hauteur" value={specs.dimensions?.hauteur ? `${specs.dimensions.hauteur} mm` : null} />
                <SpecItem label="Empattement" value={specs.dimensions?.empattement ? `${specs.dimensions.empattement} mm` : null} isLast />
            </div>

            {/* ESTHÉTIQUE */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <CarIcon className="w-5 h-5 text-indigo-500" /> Esthétique
                </h3>
                <SpecItem label="Jantes aluminium" value={specs.esthetique?.jantesAlu} />
                <SpecItem label="Sellerie" value={specs.esthetique?.sellerie} />
                <SpecItem label="Volant cuir" value={specs.esthetique?.volantCuir ? "Oui" : "Non"} />
                <SpecItem label="Follow me home" value={specs.esthetique?.followMeHome ? "Oui" : "Non"} />
                <SpecItem label="Lumière ambiance" value={specs.esthetique?.lumiereAmbiance ? "Oui" : "Non"} />
                <SpecItem label="Feux de jour" value={specs.esthetique?.feuxJour} />
                <SpecItem label="Type phares" value={specs.esthetique?.phares} />
                <SpecItem label="Toit ouvrant / Panoramique" value={specs.esthetique?.toit} />
                <SpecItem label="Barres de toit" value={specs.esthetique?.barresToit ? "Oui" : "Non"} />
                <SpecItem label="Vitres surteintées" value={specs.esthetique?.vitresSurteintees ? "Oui" : "Non"} isLast />
            </div>

            {/* SAFETY */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group md:col-span-2">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-rose-500" /> Sécurité
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <FeatureBadge label="Airbags" available={(specs.securite?.airbags ?? 0) > 0} />
                    <FeatureBadge label="ABS" available={specs.securite?.abs} />
                    <FeatureBadge label="ESP" available={specs.securite?.esp} />
                    <FeatureBadge label="Isofix" available={specs.securite?.isofix} />
                    <FeatureBadge label="Antipatinage" available={specs.securite?.antipatinage} />
                    <FeatureBadge label="AFU (Aide Freinage Urgence)" available={specs.securite?.aideFreinageUrgence} />
                    <FeatureBadge label="Anti-démarrage" available={specs.securite?.antidemarrage} />
                    <FeatureBadge label="Aide démarrage en côte" available={specs.securite?.aideDemarrageCote} />
                    <FeatureBadge label="Mode de conduite" available={specs.securite?.modeConduite} />
                    <FeatureBadge label="Détecteur de fatigue" available={specs.securite?.detecteurFatigue} />
                    <FeatureBadge label="Maintien dans la voie" available={specs.securite?.maintienVoie} />
                    <FeatureBadge label="Détecteur angle mort" available={specs.securite?.detecteurAngleMort} />
                    <FeatureBadge label="Sous gonflage" available={specs.securite?.detecteurSousGonflage} />
                    <FeatureBadge label="Fermeture auto" available={specs.securite?.fermetureAuto} />
                    <FeatureBadge label="Phares antibrouillard" available={specs.securite?.pharesAntibrouillard} />
                    <FeatureBadge label="Alarme" available={specs.securite?.alarme} />
                </div>
            </div>

            {/* COMFORT & TECHNOLOGY */}
            <div className="rounded-[2.5rem] p-8 bg-white border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group md:col-span-2">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-blue-500" /> Confort & Technologie
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <OptionBadge label="Climatisation" value={specs.confort?.climatisation} />
                    <OptionBadge label="Système audio" value={specs.confort?.systemeAudio} />
                    <OptionBadge label="Ordinateur de bord" value={specs.confort?.ordinateurBord} />
                    <OptionBadge label="Start & Stop" value={specs.confort?.startStop} />
                    <OptionBadge label="Régulateur/Limiteur" value={specs.confort?.regulateurVitesse} />
                    <OptionBadge label="Détecteur de pluie" value={specs.confort?.detecteurPluie} />
                    <OptionBadge label="Allumage auto des feux" value={specs.confort?.allumageAutoFeux} />
                    <OptionBadge label="Frein à main électrique" value={specs.confort?.freinMainElectrique} />
                    <OptionBadge label="Écran tactile" value={specs.confort?.ecranTactile} />
                    <OptionBadge label="Cockpit digital" value={specs.confort?.cockpitDigital} />
                    <OptionBadge label="Reconnaissance panneaux" value={specs.confort?.reconnaissancePanneaux} />
                    <OptionBadge label="Affichage tête haute" value={specs.confort?.affichageTeteHaute} />
                    <OptionBadge label="Caméra de recul" value={specs.confort?.cameraRecul} />
                    <OptionBadge label="Radar stationnement" value={specs.confort?.radarStationnement} />
                    <OptionBadge label="Park Assist" value={specs.confort?.parkAssist} />
                    <OptionBadge label="Commandes au volant" value={specs.confort?.commandesVolant} />
                    <OptionBadge label="Commandes vocales" value={specs.confort?.commandesVocales} />
                    <OptionBadge label="Volant réglable" value={specs.confort?.volantReglable} />
                    <OptionBadge label="Vitres électriques" value={specs.confort?.vitresElectriques} />
                    <OptionBadge label="Rétro. électriques" value={specs.confort?.retrosElectriques} />
                    <OptionBadge label="Rétro. rabattables" value={specs.confort?.retrosRabattables} />
                    <OptionBadge label="Coffre électrique" value={specs.confort?.coffreElectrique} />
                    <OptionBadge label="Accès mains libres" value={specs.confort?.mainsLibres} />
                    <OptionBadge label="Sièges électriques" value={specs.confort?.siegesElectriques} />
                    <OptionBadge label="Sièges à mémoire" value={specs.confort?.siegesMemoire} />
                    <OptionBadge label="Banquette rabattable" value={specs.confort?.banquetteRabattable} />
                    <OptionBadge label="Navigation GPS" value={specs.confort?.navigationGps} />
                    <OptionBadge label="Hotspot WiFi" value={specs.confort?.wifi} />
                    <OptionBadge label="Bluetooth" value={specs.confort?.bluetooth} />
                    <OptionBadge label="Apple CarPlay" value={specs.confort?.appleCarplay} />
                    <OptionBadge label="Android Auto" value={specs.confort?.androidAuto} />
                    <OptionBadge label="Chargeur sans fil" value={specs.confort?.chargeurSansFil} />
                </div>
            </div>

        </div>
    );
};

export default TechnicalSpecs;
