import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const brands = [
    { name: "Toyota", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg" },
    { name: "Renault", logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Renault_2021_logo.svg" },
    { name: "Hyundai", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg" },
    { name: "Volkswagen", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Volkswagen_Logo_till_1995.svg" },
    { name: "Peugeot", logo: "https://upload.wikimedia.org/wikipedia/en/9/9d/Peugeot_2021_Logo.svg" },
    { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    { name: "Mercedes", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
    { name: "Audi", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" }
];

const BrandsGrid = () => {
    return (
        <section className="py-24 bg-[#F9FAFB] border-y border-black/[0.03]" id="brands">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                        Explorez par <span className="text-emerald-500">marque</span>
                    </h2>
                    <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
                        Découvrez notre catalogue complet des meilleures marques automobiles disponibles au Maroc.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                    {brands.map((brand, index) => (
                        <Link
                            key={index}
                            href={`/brand/${brand.name.toLowerCase()}`}
                            className="group flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white border border-zinc-100 hover:border-emerald-200 shadow-sm hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] transition-all duration-500"
                        >
                            <div className="h-16 w-16 mb-4 flex items-center justify-center">
                                <img
                                    src={brand.logo}
                                    alt={`${brand.name} logo`}
                                    className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className="text-xs font-black uppercase tracking-wider text-zinc-400 group-hover:text-emerald-600 transition-colors">
                                {brand.name}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="inline-flex items-center gap-2 text-zinc-600 font-bold hover:text-emerald-600 transition-colors group">
                        Voir toutes les marques
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BrandsGrid;
