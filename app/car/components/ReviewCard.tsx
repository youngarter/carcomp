"use client";
import React from "react";
import { Star } from "lucide-react";

interface ReviewCardProps {
    review: {
        id: string;
        userName: string | null;
        rating: number;
        comment: string | null;
        createdAt: Date;
    };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
    return (
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="font-black text-zinc-900 text-sm uppercase tracking-wider">{review.userName || "Utilisateur"}</p>
                    <p className="text-[10px] text-zinc-400 font-bold mt-1">
                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            className={`w-3 h-3 ${s <= review.rating ? "fill-emerald-500 text-emerald-500" : "text-zinc-200"}`}
                        />
                    ))}
                </div>
            </div>
            <p className="text-zinc-500 leading-relaxed text-sm font-medium italic">"{review.comment}"</p>
        </div>
    );
};

export default ReviewCard;
