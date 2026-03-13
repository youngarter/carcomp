import React from "react";
import Link from "next/link";
import { ArrowLeft, Car as CarIcon, Search } from "lucide-react";
import { getSimilarCars } from "../../../actions";
import VehicleCard from "../../../components/VehicleCard";
import MotionWrapper from "../../../components/MotionWrapper";

export default async function NotFound() {
    // Fetch 8 similar cars (using SUV as default fallback category)
    const similarCars = await getSimilarCars("SUV", undefined, 8);

    return (
        <MotionWrapper className="min-h-screen bg-[#FDFDFF] py-20 font-sans">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12">

                {/* 404 Header Message */}
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-8 text-rose-500">
                        <Search className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-zinc-900 mb-6 tracking-tight leading-tight">
                        Oups ! Véhicule <br /><span className="text-rose-500">Introuvable</span>
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mb-10 leading-relaxed">
                        Il semble que cette version spécifique ou ce modèle n'existe pas ou n'est plus disponible dans notre base de données.
                        Ne vous inquiétez pas, nous avons d'autres options passionnantes pour vous !
                    </p>
                    <Link
                        href="/car"
                        className="flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all active:scale-95 shadow-xl"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour au catalogue
                    </Link>
                </div>

                {/* Recommendations Section */}
                {similarCars.length > 0 && (
                    <section>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900 mb-2 tracking-tight">
                                    Découvrez ces alternatives
                                </h2>
                                <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                                    Suggestions basées sur les modèles populaires
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest">
                                    {similarCars.length} modèles disponibles
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {similarCars.map((car: any) => (
                                <VehicleCard
                                    key={car.id}
                                    trim={car}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Secondary Help Section */}
                <div className="mt-24 p-12 rounded-[3.5rem] bg-zinc-900 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-3xl font-black mb-4 tracking-tight">Vous ne trouvez pas votre bonheur ?</h3>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Notre intelligence artificielle peut vous aider à trouver le véhicule parfait selon vos besoins et votre budget au Maroc.
                        </p>
                        <Link
                            href="/ia-search"
                            className="inline-flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all active:scale-95"
                        >
                            Essayer la recherche IA
                        </Link>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 select-none pointer-events-none">
                        <CarIcon className="w-96 h-96" />
                    </div>
                </div>
            </div>
        </MotionWrapper>
    );
}
