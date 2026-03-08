"use client";

import React, { useState, useEffect } from "react";

// Components
import Chatbot from "./car/components/Chatbot";
import Header from "./car/components/Header";
import Footer from "./car/components/Footer";
import HeroCarousel from "./car/components/HeroCarousel";
import AISearch from "./car/components/AISearch";
import PromotionCars from "./car/components/PromotionCars";
import BrandsGrid from "./car/components/BrandsGrid";
import AIComparisons from "./car/components/AIComparisons";
import UserExperiences from "./car/components/UserExperiences";
import FeaturedArticles from "./car/components/FeaturedArticles";

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

  const filteredCatalog = catalog.filter((t) =>
    t.model?.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.model?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function loadCatalog() {
      const data = await getFinitionCatalog();

      const mappedData: Car[] = data.map((f: any) => ({
        id: f.id,
        slug: f.slug,
        name: f.name,
        price: f.price,
        isPromoted: f.isPromoted,
        promotionalPrice: f.priceHistories?.[0]?.promotionalPrice || null,
        promoStartDate: f.priceHistories?.[0]?.startDate ? new Date(f.priceHistories[0].startDate).toISOString() : null,
        promoEndDate: f.priceHistories?.[0]?.endDate ? new Date(f.priceHistories[0].endDate).toISOString() : null,
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
    }
    loadCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <Chatbot />

      <main className="flex flex-col">
        <HeroCarousel />

        <AISearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={() => {
            document.getElementById('promotions')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <div id="promotions">
          <PromotionCars
            cars={filteredCatalog}
            onCompare={addTrimToCompare}
            comparingTrims={comparingTrims}
          />
        </div>

        <BrandsGrid />

        <AIComparisons />

        <UserExperiences />

        <FeaturedArticles />
      </main>

      <Footer />
    </div>
  );
}
