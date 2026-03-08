"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
    "Voiture pour famille 5 personnes",
    "Voiture économique pour la ville",
    "SUV spacieux pour voyage",
    "Voiture fiable moins de 200000dh",
    "Citadine facile à garer",
];

interface AISearchProps {
    value?: string;
    onChange?: (val: string) => void;
    onSubmit?: (val: string) => void;
}

const AISearch = ({ value = "", onChange, onSubmit }: AISearchProps) => {
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocalValue(suggestion);
        if (onChange) onChange(suggestion);
        if (onSubmit) onSubmit(suggestion);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSubmit) {
            onSubmit(localValue);
        }
    };

    return (
        <section className="relative w-full py-10 bg-[#FDFDFF] overflow-hidden" id="search">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 mb-6"
                    >
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 shadow-inner">
                            <Sparkles className="w-8 h-8 text-emerald-500" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 ml-4">
                            Que recherchez-vous ?
                        </h2>

                    </motion.div>
                    <p className="text-lg text-zinc-500 font-medium text-center mt-4">
                        Décrivez votre voiture idéale en langage naturel ou parlez de vos besoins.
                    </p>

                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="relative group w-full mb-8"
                >
                    <div className={`absolute -inset-1 rounded-[40px] blur-xl transition-all duration-500 opacity-20 ${isFocused ? 'bg-emerald-500 opacity-40' : 'bg-transparent'}`} />

                    <div className="relative flex items-center bg-white rounded-[32px] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        <div className="pl-6 text-emerald-500 animate-pulse">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            value={localValue}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Ex: SUV under 300000 MAD, Family car for 5 people..."
                            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 py-5 pl-4 pr-6 text-lg md:text-xl font-medium text-zinc-800 placeholder:text-zinc-400"
                        />
                        <button
                            onClick={() => onSubmit && onSubmit(localValue)}
                            className="mr-2 p-4 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-all active:scale-95 shadow-md"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                </motion.div>


                <div className="flex flex-wrap items-center justify-center gap-3">
                    {suggestions.map((suggestion, index) => (
                        <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 rounded-full bg-zinc-50 text-zinc-600 text-sm font-medium border border-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all cursor-pointer shadow-sm"
                        >
                            {suggestion}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-100/30 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
};

export default AISearch;
