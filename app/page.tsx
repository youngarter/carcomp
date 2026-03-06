"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

// Components
import Chatbot from "./car/components/Chatbot";
import VehicleCard from "./car/components/VehicleCard";
import Header from "./car/components/Header";
import Footer from "./car/components/Footer";
import HeroSection from "./car/components/HeroSection";
import SearchBar from "./car/components/SearchBar";
import { getFinitionCatalog } from "./car/actions";
import { useStore } from "../store/useStore";
import { Car } from "../types/car";

export default function Home() {
  const {
    addTrimToCompare,
    comparingTrims,
    searchQuery, setSearchQuery
  } = useStore();

  const [catalog, setCatalog] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredCatalog = catalog.filter((t) =>
    t.model.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function loadCatalog() {
      const data = await getFinitionCatalog();

      const mappedData: Car[] = data.map((f: any) => ({
        id: f.id,
        slug: f.slug, // New slug field
        name: f.name,
        price: f.price,
        images: f.images || [],
        image: f.image,
        model: {
          name: f.carModel.name,
          brand: { name: f.carModel.brand.name },
          category: f.carModel.category,
          imageUrl: f.carModel.image,
          aiScore: f.carModel.aiScore,
          reliability: f.carModel.reliability,
          maintCost: f.carModel.maintCost,
        },
        specs: {
          moteur: {
            energie: f.energy,
            motorisation: f.motorisation,
            puissanceDynamique: f.power ? `${f.power}ch` : null,
            transmission: f.transmission,
            boiteAVitesse: f.gearbox,
            emplacement: f.emplacement,
            fiscalPower: f.fiscalPower,
            cylindree: f.cylindree,
            coupleMax: f.coupleMax,
            palettesVolant: f.palettesVolant,
            powerThermique: f.powerThermique,
            powerElec: f.powerElec,
            batteryCapacity: f.batteryCapacity
          },
          consoPerformances: {
            consoMixte: f.consoMixed?.toString(),
            co2Emission: f.co2Emission?.toString(),
            vitesseMax: f.maxSpeed ? `${f.maxSpeed} km/h` : null,
            acceleration: f.acceleration ? `${f.acceleration}s` : null,
            consoCity: f.consoCity,
            consoRoad: f.consoRoad
          },
          dimensions: {
            places: f.seats,
            volumeCoffre: f.trunkVolume,
            volumeReservoir: f.tankVolume,
            poids: f.weight,
            longueur: f.length,
            largeur: f.width,
            hauteur: f.height,
            empattement: f.wheelbase
          },
          securite: {
            airbags: f.airbags,
            abs: f.abs,
            esp: f.esp,
            isofix: f.isofix,
            antipatinage: f.antipatinage,
            aideFreinageUrgence: f.aideFreinageUrgence,
            antidemarrage: f.antidemarrage,
            aideDemarrageCote: f.aideDemarrageCote,
            modeConduite: f.modeConduite,
            detecteurFatigue: f.detecteurFatigue,
            maintienVoie: f.maintienVoie,
            detecteurAngleMort: f.detecteurAngleMort,
            detecteurSousGonflage: f.detecteurSousGonflage,
            fermetureAuto: f.fermetureAuto,
            pharesAntibrouillard: f.pharesAntibrouillard,
            alarme: f.alarme
          },
          confort: {
            climatisation: f.climatisation,
            systemeAudio: f.systemeAudio,
            ordinateurBord: f.ordinateurBord,
            startStop: f.startStop,
            regulateurVitesse: f.regulateurVitesse,
            detecteurPluie: f.detecteurPluie,
            allumageAutoFeux: f.allumageAutoFeux,
            freinMainElectrique: f.freinMainElectrique,
            ecranTactile: f.ecranTactile,
            cockpitDigital: f.cockpitDigital,
            reconnaissancePanneaux: f.reconnaissancePanneaux,
            affichageTeteHaute: f.affichageTeteHaute,
            cameraRecul: f.cameraRecul,
            radarStationnement: f.radarStationnement,
            parkAssist: f.parkAssist,
            commandesVolant: f.commandesVolant,
            commandesVocales: f.commandesVocales,
            volantReglable: f.volantReglable,
            vitresElectriques: f.vitresElectriques,
            retrosElectriques: f.retrosElectriques,
            retrosRabattables: f.retrosRabattables,
            coffreElectrique: f.coffreElectrique,
            mainsLibres: f.mainsLibres,
            siegesElectriques: f.siegesElectriques,
            siegesMemoire: f.siegesMemoire,
            banquetteRabattable: f.banquetteRabattable,
            navigationGps: f.navigationGps,
            wifi: f.wifi,
            bluetooth: f.bluetooth,
            appleCarplay: f.appleCarplay,
            chargeurSansFil: f.chargeurSansFil
          },
          esthetique: {
            jantesAlu: f.jantesAlu,
            sellerie: f.sellerie,
            volantCuir: f.volantCuir,
            followMeHome: f.followMeHome,
            lumiereAmbiance: f.lumiereAmbiance,
            feuxJour: f.feuxJour,
            phares: f.phares,
            toit: f.toit,
            barresToit: f.barresToit,
            vitresSurteintees: f.vitresSurteintees
          }
        }
      }));

      setCatalog(mappedData);
      setLoading(false);
    }
    loadCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <Chatbot />

      <main>
        <HeroSection />

        <section className="pb-32">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">
                Nos recommandations <span className="text-emerald-600">IA</span>
              </h2>
              <p className="text-zinc-500 font-medium max-w-2xl mx-auto mb-12">
                Véhicules sélectionnés par notre algorithme selon les tendances du marché marocain et la fiabilité reconnue.
              </p>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {loading ? (
              <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 border-[10px] border-emerald-50 border-t-emerald-600 rounded-full animate-spin shadow-2xl shadow-emerald-100" />
                <p className="font-black text-[10px] uppercase tracking-[0.4em] text-emerald-600 animate-pulse">Intelligence en action...</p>
              </div>
            ) : filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredCatalog.map((t) => (
                  <VehicleCard
                    key={t.id}
                    trim={t}
                    onCompare={addTrimToCompare}
                    onViewDetails={() => { }}
                    isComparing={!!comparingTrims.find((ct) => ct.id === t.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full py-32 bg-white/50 backdrop-blur-sm rounded-[60px] border border-zinc-100 text-center shadow-sm">
                <div className="w-24 h-24 bg-zinc-50 rounded-full mx-auto mb-10 flex items-center justify-center shadow-inner">
                  <Search className="w-12 h-12 text-zinc-200" />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 mb-6">Aucun résultat trouvé</h3>
                <p className="text-zinc-500 font-medium max-w-md mx-auto leading-relaxed">
                  Notre IA n&apos;a pas trouvé de correspondance exacte. Essayez de simplifier vos critères ou de lancer un nouveau diagnostic.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
