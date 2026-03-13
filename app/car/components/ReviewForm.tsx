"use client";

import React, { useState } from "react";
import { Star, Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitReview } from "../actions";

interface ReviewFormProps {
    carModelId: string;
}

export default function ReviewForm({ carModelId }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [userName, setUserName] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Veuillez donner une note");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("carModelId", carModelId);
        formData.append("rating", rating.toString());
        formData.append("userName", userName);
        formData.append("comment", comment);

        const result = await submitReview(formData);

        if (result.success) {
            setIsSuccess(true);
            setRating(0);
            setUserName("");
            setComment("");
        } else {
            setError(result.error || "Une erreur est survenue");
        }
        setIsSubmitting(false);
    };

    if (isSuccess) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-white w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900 mb-2">Avis envoyé !</h4>
                <p className="text-emerald-700">Merci pour votre retour. Votre avis sera publié après modération.</p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 text-emerald-600 font-bold hover:underline"
                >
                    Envoyer un autre avis
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100">
            <h3 className="text-xl font-bold mb-6">Laissez votre avis</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Note</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="focus:outline-none transition-transform active:scale-95"
                            >
                                <Star
                                    className={`w-8 h-8 ${(hover || rating) >= star ? "fill-amber-400 text-amber-400" : "text-zinc-200"}`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-zinc-700 mb-2">Votre nom</label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            placeholder="Ex: Jean Dupont"
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 mb-2">Commentaire</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        placeholder="Qu'avez-vous pensé de ce véhicule ?"
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none"
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Publier mon avis
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
