"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="max-w-4xl mx-auto mb-20 px-4">
            <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-[32px] blur-2xl group-focus-within:bg-emerald-500/10 transition-all" />

                <div className="relative flex items-center">
                    <Search className="absolute left-8 text-zinc-400 w-6 h-6 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Quelle voiture recherchez-vous ? (ex: Tesla, SUV, Électrique...)"
                        className="w-full pl-20 pr-8 py-8 rounded-[32px] bg-white border border-zinc-100 shadow-2xl shadow-zinc-200/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-lg text-zinc-900 placeholder:text-zinc-300"
                    />

                    <div className="absolute right-6 hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Fuzzy Search Active
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
