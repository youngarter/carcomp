"use client";

import React, { useState, useEffect } from "react";
import {
  Car, Menu, X, Sparkles, Search, ChevronRight,
  ArrowLeft, Star, Zap, Facebook, Instagram,
  Twitter, Phone, Mail, MapPin, Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Chatbot from "./components/Chatbot";
import VehicleCard from "./components/VehicleCard";
import TechnicalSpecs from "./components/TechnicalSpecs";
import PredictiveIntelligence from "./components/PredictiveIntelligence";
import Diagnostic from "./components/Diagnostic";
import Comparator from "./components/Comparator";

import { getFinitionCatalog } from "./car/actions";

export default function Home() {
  const [activeTab, setActiveTab] = useState("catalog");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTrim, setSelectedTrim] = useState<any>(null);
  const [comparingTrims, setComparingTrims] = useState<any[]>([]);
  const [detailTab, setDetailTab] = useState("specs");
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredCatalog = catalog.filter((t) =>
    t.model.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    async function loadCatalog() {
      const data = await getFinitionCatalog();

      const mappedData = data.map((f: any) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        images: f.images || [],
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

  const addTrimToCompare = (trim: any) => {
    if (!comparingTrims.find((t) => t.id === trim.id)) {
      setComparingTrims([...comparingTrims, trim]);
    }
  };

  const removeTrimFromCompare = (id: string) => {
    setComparingTrims(comparingTrims.filter((t) => t.id !== id));
  };

  const clearComparison = () => {
    setComparingTrims([]);
  };

  const viewDetails = (trim: any) => {
    setSelectedTrim(trim);
    setSelectedImage(null);
    setActiveTab("details");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Chatbot />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("catalog")}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tighter text-zinc-900">
                AUTO<span className="text-emerald-600">ADVISOR</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`text-sm font-bold tracking-tight transition-colors ${activeTab === "catalog" ? "text-emerald-600" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Catalogue
              </button>
              <button
                onClick={() => setActiveTab("diagnostic")}
                className={`text-sm font-bold tracking-tight transition-colors ${activeTab === "diagnostic" ? "text-emerald-600" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Diagnostic IA
              </button>
              <button
                onClick={() => setActiveTab("comparator")}
                className={`text-sm font-bold tracking-tight transition-colors ${activeTab === "comparator" ? "text-emerald-600" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                Comparateur
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                Se connecter
              </button>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-500">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-white pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              <button onClick={() => { setActiveTab("catalog"); setIsMenuOpen(false); }} className="text-2xl font-black text-zinc-900 text-left">Catalogue</button>
              <button onClick={() => { setActiveTab("diagnostic"); setIsMenuOpen(false); }} className="text-2xl font-black text-zinc-900 text-left">Diagnostic IA</button>
              <button onClick={() => { setActiveTab("comparator"); setIsMenuOpen(false); }} className="text-2xl font-black text-zinc-900 text-left">Comparateur</button>
              <hr className="border-zinc-100" />
              <button className="w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold">Se connecter</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Catalog Section */}
        {activeTab === "catalog" && (
          <div className="mb-16">
            <div className="max-w-3xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest mb-6"
              >
                <Sparkles className="w-3 h-3" /> Propulsé par l&apos;IA
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.9] mb-8"
              >
                Trouvez la voiture <br />
                <span className="text-emerald-600 italic">qui vous ressemble.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-zinc-500 font-medium leading-relaxed"
              >
                AutoAdvisor AI analyse vos besoins réels pour vous recommander les meilleurs véhicules au Maroc. Fini l&apos;indécision, place à la clarté.
              </motion.p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une marque, un modèle..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-zinc-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
              <button
                onClick={() => setActiveTab("diagnostic")}
                className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                Lancer le Diagnostic IA <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="font-bold text-zinc-400">Chargement du catalogue...</p>
              </div>
            ) : filteredCatalog.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCatalog.map((t) => (
                  <VehicleCard
                    key={t.id}
                    trim={t}
                    onCompare={addTrimToCompare}
                    onViewDetails={viewDetails}
                    isComparing={!!comparingTrims.find((ct) => ct.id === t.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full py-20 bg-white rounded-[40px] border border-black/5 text-center">
                <Car className="w-16 h-16 text-zinc-100 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-zinc-500 font-medium">Revenez plus tard ou ajoutez un nouveau véhicule.</p>
              </div>
            )}
          </div>
        )}

        {/* Details Section */}
        {activeTab === "details" && selectedTrim && (
          <div className="py-12">
            <button
              onClick={() => setActiveTab("catalog")}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour au catalogue
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-100 shadow-xl border border-black/5">
                  <img
                    src={selectedImage || selectedTrim.model!.imageUrl}
                    alt={selectedTrim.model!.name}
                    className="w-full h-full object-cover transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {selectedTrim.images && selectedTrim.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-4">
                    <div
                      onClick={() => setSelectedImage(selectedTrim.model!.imageUrl)}
                      className={`aspect-square rounded-2xl bg-zinc-100 overflow-hidden cursor-pointer border-2 transition-all ${(!selectedImage || selectedImage === selectedTrim.model!.imageUrl) ? "border-emerald-500 scale-95 shadow-inner" : "border-transparent hover:border-zinc-300"}`}
                    >
                      <img
                        src={selectedTrim.model!.imageUrl}
                        alt="Vue principale"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {selectedTrim.images.map((img: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square rounded-2xl bg-zinc-100 overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === img ? "border-emerald-500 scale-95 shadow-inner" : "border-transparent hover:border-zinc-300"}`}
                      >
                        <img
                          src={img}
                          alt={`Aperçu ${i + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
                  {selectedTrim.model!.category}
                </div>
                <h1 className="text-5xl font-black text-zinc-900 mb-2">
                  {selectedTrim.model!.brand!.name} {selectedTrim.model!.name}
                </h1>
                <p className="text-2xl font-bold text-emerald-600 mb-8" suppressHydrationWarning>
                  Finition : {selectedTrim.name} — {selectedTrim.price.toLocaleString("fr-FR")} DH
                </p>

                <div className="grid grid-cols-2 gap-8 p-8 bg-white rounded-3xl border border-black/5 shadow-sm mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Energie</p>
                    <p className="font-bold text-zinc-900">{selectedTrim.specs.moteur.energie}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Boîte</p>
                    <p className="font-bold text-zinc-900">{selectedTrim.specs.moteur.boiteAVitesse}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Puissance</p>
                    <p className="font-bold text-zinc-900">{selectedTrim.specs.moteur.puissanceDynamique}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Conso. Mixte</p>
                    <p className="font-bold text-zinc-900">{selectedTrim.specs.consoPerformances.consoMixte}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                    Demander un devis
                  </button>
                  <button
                    onClick={() => addTrimToCompare(selectedTrim)}
                    className={`px-8 py-4 rounded-2xl border font-bold transition-all ${comparingTrims.find(t => t.id === selectedTrim.id) ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
                  >
                    Comparer
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex gap-8 border-b border-zinc-100 mb-8">
                <button
                  onClick={() => setDetailTab("specs")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all border-b-2 ${detailTab === "specs" ? "text-emerald-600 border-emerald-600" : "text-zinc-400 border-transparent hover:text-zinc-900"}`}
                >
                  Fiche Technique
                </button>
                <button
                  onClick={() => setDetailTab("predictive")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all border-b-2 ${detailTab === "predictive" ? "text-emerald-600 border-emerald-600" : "text-zinc-400 border-transparent hover:text-zinc-900"}`}
                >
                  Intelligence Prédictive
                </button>
                <button
                  onClick={() => setDetailTab("reviews")}
                  className={`pb-4 text-sm font-bold tracking-tight transition-all border-b-2 ${detailTab === "reviews" ? "text-emerald-600 border-emerald-600" : "text-zinc-400 border-transparent hover:text-zinc-900"}`}
                >
                  Avis & Notation
                </button>
              </div>

              <AnimatePresence mode="wait">
                {detailTab === "specs" && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <TechnicalSpecs specs={selectedTrim.specs} />
                  </motion.div>
                )}
                {detailTab === "predictive" && (
                  <motion.div key="predictive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <PredictiveIntelligence trim={selectedTrim} />
                  </motion.div>
                )}
                {detailTab === "reviews" && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm">
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                          <Star className="w-5 h-5 text-emerald-500" /> Note Globale IA
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-5xl font-black text-zinc-900">8.8</div>
                          <div className="flex flex-col">
                            <div className="flex text-emerald-500">
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current" />
                              <Star className="w-4 h-4 fill-current opacity-50" />
                            </div>
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Basé sur 1.2k avis</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-900 mb-1 uppercase tracking-widest">Points Forts</p>
                            <p className="text-sm text-emerald-800">Excellent rapport qualité/prix, consommation maîtrisée, confort de suspension.</p>
                          </div>
                          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <p className="text-xs font-bold text-rose-900 mb-1 uppercase tracking-widest">Points Faibles</p>
                            <p className="text-sm text-rose-800">Insonorisation à haute vitesse, plastiques intérieurs durs.</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm">
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-emerald-500" /> Résumé Automatique IA
                        </h3>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                          &quot;Le {selectedTrim.model!.name} s&apos;impose comme une référence sur le marché marocain pour ceux qui cherchent la polyvalence sans se ruiner. Sa motorisation {selectedTrim.specs.moteur.motorisation} offre un bon compromis entre dynamisme et économie. Idéal pour les familles urbaines.&quot;
                        </p>
                        <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-zinc-200" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">Dernier avis utilisateur</p>
                            <p className="text-[10px] text-zinc-400">&quot;Très satisfait de mon achat, la consommation est bluffante en ville.&quot;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Diagnostic Section */}
        {activeTab === "diagnostic" && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black tracking-tight text-zinc-900 mb-4">Diagnostic Intelligent</h2>
              <p className="text-zinc-500 font-medium max-w-xl mx-auto">
                Répondez à quelques questions et laissez notre IA trouver le véhicule parfait pour votre style de vie.
              </p>
            </div>
            <Diagnostic />
          </div>
        )}

        {/* Comparator Section */}
        {activeTab === "comparator" && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black tracking-tight text-zinc-900 mb-4">Comparateur Intelligent</h2>
              <p className="text-zinc-500 font-medium max-w-xl mx-auto">
                Comparez les chiffres, mais aussi la fiabilité, le coût d&apos;entretien et la valeur de revente.
              </p>
            </div>
            <Comparator
              vehicles={comparingTrims}
              onRemove={removeTrimFromCompare}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setActiveTab("catalog")}>
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tighter text-zinc-900">
                  AUTO<span className="text-emerald-600">ADVISOR</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-6">
                Votre conseiller automobile intelligent au Maroc. Nous vous aidons à prendre la meilleure décision d&apos;achat.
              </p>
              <div className="flex gap-4">
                <button className="p-2 rounded-lg bg-zinc-50 text-zinc-400 hover:text-emerald-600 transition-colors"><Facebook className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg bg-zinc-50 text-zinc-400 hover:text-emerald-600 transition-colors"><Instagram className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg bg-zinc-50 text-zinc-400 hover:text-emerald-600 transition-colors"><Twitter className="w-5 h-5" /></button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 mb-6">Plateforme</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setActiveTab("catalog")} className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Catalogue Neuf</button></li>
                <li><button onClick={() => setActiveTab("catalog")} className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Occasions</button></li>
                <li><button onClick={() => setActiveTab("diagnostic")} className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Diagnostic IA</button></li>
                <li><button onClick={() => setActiveTab("comparator")} className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Comparateur</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 mb-6">Services</h4>
              <ul className="space-y-4">
                <li><button className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Cote de l&apos;occasion</button></li>
                <li><button className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Assurance Auto</button></li>
                <li><button className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Crédit Auto</button></li>
                <li><button className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Essais &amp; Actualités</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-zinc-500"><Phone className="w-4 h-4" /> +212 5 22 00 00 00</li>
                <li className="flex items-center gap-3 text-sm text-zinc-500"><Mail className="w-4 h-4" /> contact@autoadvisor.ma</li>
                <li className="flex items-center gap-3 text-sm text-zinc-500"><MapPin className="w-4 h-4" /> Casablanca, Maroc</li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400 font-medium">© 2024 AutoAdvisor AI. Tous droits réservés.</p>
            <div className="flex gap-8">
              <button className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Mentions légales</button>
              <button className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Confidentialité</button>
              <button className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {comparingTrims.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="bg-zinc-900 text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{comparingTrims.length} véhicules sélectionnés</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Prêt pour la comparaison</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearComparison}
                  className="px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                >
                  Vider
                </button>
                <button
                  onClick={() => setActiveTab("comparator")}
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors"
                >
                  Comparer maintenant
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
