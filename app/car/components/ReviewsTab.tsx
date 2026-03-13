"use client";
import React from "react";
import { Star, MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface ReviewsTabProps {
    reviews: any[];
    carModelId: string;
}

export default function ReviewsTab({ reviews, carModelId }: ReviewsTabProps) {
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "0";

    const lastReview = reviews.length > 0 ? reviews[0] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Overall Rating */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-[3rem] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100 flex flex-col items-center justify-center text-center">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8">Note globale</h3>

                    <span className="text-7xl font-black text-zinc-900 tracking-tighter tabular-nums mb-4">{averageRating} <span className="text-2xl text-zinc-400">/5</span></span>

                    <div className="flex gap-1.5 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={`w-6 h-6 ${s <= parseFloat(averageRating) ? "fill-amber-400 text-amber-400" : "text-zinc-100 fill-zinc-100"}`}
                            />
                        ))}
                    </div>

                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-2 bg-zinc-50 px-4 py-2 rounded-xl">
                        Basé sur {reviews.length} avis
                    </p>
                </div>

                <div className="bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100/50">
                    <h3 className="text-xl font-black text-emerald-950 mb-6 tracking-tight flex items-center gap-2">
                        Laisser un avis <MessageSquare className="w-5 h-5 text-emerald-500" />
                    </h3>
                    <ReviewForm carModelId={carModelId} />
                </div>
            </div>

            {/* Right Column: Reviews List */}
            <div className="lg:col-span-8 flex flex-col">
                <div className="bg-white rounded-[3rem] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-zinc-100 h-full">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                        <span>Derniers avis</span>
                    </h3>

                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200">
                            <MessageSquare className="w-12 h-12 text-zinc-300 mb-4" />
                            <p className="text-zinc-900 font-bold mb-2 text-lg">Aucun avis pour le moment.</p>
                            <p className="text-zinc-500 text-sm font-medium">Soyez le premier à partager votre expérience !</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
