"use client";
import React from "react";
import { Zap, Settings, Ruler, ShieldCheck, Car } from "lucide-react";

interface TechnicalSpecsProps {
    specs: any;
}

const TechnicalSpecs = ({ specs }: TechnicalSpecsProps) => {
    const sections = [
        {
            title: "Moteur & Transmission",
            icon: <Zap className="w-5 h-5 text-emerald-500" />,
            items: [
                { label: "Motorisation", value: specs.moteur?.motorisation },
                { label: "Energie", value: specs.moteur?.energie },
                { label: "Puissance", value: specs.moteur?.puissanceDynamique },
                { label: "Transmission", value: specs.moteur?.transmission },
                { label: "Boîte", value: specs.moteur?.boiteAVitesse },
                { label: "Cylindrée", value: specs.moteur?.cylindree ? `${specs.moteur.cylindree} cm3` : null },
                { label: "Couple", value: specs.moteur?.coupleMax ? `${specs.moteur.coupleMax} Nm` : null },
            ],
        },
        {
            title: "Sécurité",
            icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
            items: [
                { label: "Airbags", value: specs.securite?.airbags },
                { label: "ABS", value: specs.securite?.abs ? "Oui" : "Non" },
                { label: "ESP", value: specs.securite?.esp ? "Oui" : "Non" },
                { label: "ISOFIX", value: specs.securite?.isofix ? "Oui" : "Non" },
                { label: "Antipatinage", value: specs.securite?.antipatinage ? "Oui" : "Non" },
                { label: "Aide au Freinage", value: specs.securite?.aideFreinageUrgence ? "Oui" : "Non" },
                { label: "Angle Mort", value: specs.securite?.detecteurAngleMort ? "Oui" : "Non" },
                { label: "Maintien Voie", value: specs.securite?.maintienVoie ? "Oui" : "Non" },
            ],
        },
        {
            title: "Dimensions",
            icon: <Ruler className="w-5 h-5 text-purple-500" />,
            items: [
                { label: "Places", value: specs.dimensions?.places },
                { label: "Coffre", value: specs.dimensions?.volumeCoffre ? `${specs.dimensions.volumeCoffre} L` : null },
                { label: "Réservoir", value: specs.dimensions?.volumeReservoir ? `${specs.dimensions.volumeReservoir} L` : null },
                { label: "Poids", value: specs.dimensions?.poids ? `${specs.dimensions.poids} kg` : null },
                { label: "Longueur", value: specs.dimensions?.longueur ? `${specs.dimensions.longueur} mm` : null },
            ],
        },
        {
            title: "Performances",
            icon: <Settings className="w-5 h-5 text-blue-500" />,
            items: [
                { label: "Conso. Mixte", value: specs.consoPerformances?.consoMixte ? `${specs.consoPerformances.consoMixte} L/100` : null },
                { label: "CO2", value: specs.consoPerformances?.co2Emission ? `${specs.consoPerformances.co2Emission} g/km` : null },
                { label: "Vitesse Max", value: specs.consoPerformances?.vitesseMax },
                { label: "0-100 km/h", value: specs.consoPerformances?.acceleration },
            ],
        },
        {
            title: "Confort",
            icon: <Settings className="w-5 h-5 text-indigo-500" />,
            items: [
                { label: "Climatisation", value: specs.confort?.climatisation },
                { label: "Radar/Caméra", value: specs.confort?.cameraRecul ? "Caméra + Radar" : specs.confort?.radarStationnement },
                { label: "Écran Tactile", value: specs.confort?.ecranTactile ? "Oui" : "Non" },
                { label: "Apple/Android", value: specs.confort?.appleCarplay ? "Oui" : "Non" },
                { label: "GPS", value: specs.confort?.navigationGps ? "Oui" : "Non" },
                { label: "Mains Libres", value: specs.confort?.mainsLibres ? "Oui" : "Non" },
            ],
        },
        {
            title: "Esthétique",
            icon: <Car className="w-5 h-5 text-amber-500" />,
            items: [
                { label: "Jantes", value: specs.esthetique?.jantesAlu },
                { label: "Sellerie", value: specs.esthetique?.sellerie },
                { label: "Phares", value: specs.esthetique?.phares },
                { label: "Toit", value: specs.esthetique?.toit },
                { label: "Vitres Surteintées", value: specs.esthetique?.vitresSurteintees ? "Oui" : "Non" },
            ],
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
                <div key={idx} className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-8">
                        {section.icon}
                        <h3 className="text-lg font-black text-zinc-900 tracking-tight">{section.title}</h3>
                    </div>
                    <div className="space-y-4">
                        {section.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-zinc-50 last:border-0">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{item.label}</span>
                                <span className="text-sm font-black text-zinc-900">{item.value || "—"}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TechnicalSpecs;
