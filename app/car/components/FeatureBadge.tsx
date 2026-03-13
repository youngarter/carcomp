"use client";
import React from "react";
import { Check, X } from "lucide-react";

interface FeatureBadgeProps {
    label: string;
    available: string | boolean | null | undefined;
    icon?: React.ReactNode;
}

const FeatureBadge = ({ label, available, icon }: FeatureBadgeProps) => {
    const isAvailable = !!available;
    return (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${isAvailable
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm'
            : 'bg-zinc-50 border-zinc-100 text-zinc-400 opacity-60'
            }`}>
            {icon ? (
                <span className={isAvailable ? 'text-emerald-500' : 'text-zinc-300'}>{icon}</span>
            ) : (
                isAvailable
                    ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                    : <X className="w-3.5 h-3.5 text-zinc-300" />
            )}
            <span className="text-xs font-black uppercase tracking-wider">{label}</span>
        </div>
    );
};

export default FeatureBadge;
