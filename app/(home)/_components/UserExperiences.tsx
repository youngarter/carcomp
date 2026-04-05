import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        user: "Karim B.",
        avatar: "https://i.pravatar.cc/150?u=1",
        rating: 5,
        car: "Toyota Yaris Hybrid",
        carImg: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=400&auto=format&fit=crop",
        review: "Très économique en ville, consommation réelle 5.2L/100km. L'IA avait parfaitement ciblé mon besoin pour les trajets quotidiens à Casablanca."
    },
    {
        id: 2,
        user: "Sara M.",
        avatar: "https://i.pravatar.cc/150?u=2",
        rating: 5,
        car: "Peugeot 2008",
        carImg: "https://images.unsplash.com/photo-1549419137-ed8a719bf300?q=80&w=400&auto=format&fit=crop",
        review: "Design magnifique et position de conduite idéale. Le comparateur m'a aidé à la choisir face au Renault Captur sans aucun regret."
    },
    {
        id: 3,
        user: "Youssef T.",
        avatar: "https://i.pravatar.cc/150?u=3",
        rating: 4,
        car: "Dacia Duster",
        carImg: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=400&auto=format&fit=crop",
        review: "Imbattable pour les week-ends dans l'Atlas. L'outil m'a recommandé la version 4x4 et c'est exactement ce qu'il me fallait pour mes aventures."
    },
    {
        id: 4,
        user: "Amine R.",
        avatar: "https://i.pravatar.cc/150?u=4",
        rating: 5,
        car: "Hyundai Tucson",
        carImg: "https://images.unsplash.com/photo-1629897048514-3dd7414df7fd?q=80&w=400&auto=format&fit=crop",
        review: "Espace généreux pour toute la famille. Le score de fiabilité de l'IA m'a rassuré sur cet investissement à long terme."
    }
];

const UserExperiences = () => {
    return (
        <section className="py-24 bg-[#F9FAFB] border-t border-black/[0.03]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                        Expériences <span className="text-emerald-500">réelles</span>
                    </h2>
                    <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
                        Découvrez les avis authentiques de conducteurs ayant trouvé leur véhicule idéal grâce à notre IA.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-zinc-100 flex flex-col h-full relative group">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-100 group-hover:text-emerald-200 transition-colors" />

                            {/* User Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <img src={testimonial.avatar} alt={testimonial.user} className="w-12 h-12 rounded-full ring-2 ring-zinc-50 object-cover" />
                                <div>
                                    <h4 className="font-bold text-zinc-900">{testimonial.user}</h4>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 fill-zinc-200'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-zinc-600 font-medium leading-relaxed mb-6 flex-grow">
                                "{testimonial.review}"
                            </p>

                            {/* Owned Car Badge */}
                            <div className="mt-auto flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100/80">
                                <img src={testimonial.carImg} alt={testimonial.car} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Modèle choisi</span>
                                    <span className="text-sm font-bold text-zinc-900 truncate">{testimonial.car}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserExperiences;
