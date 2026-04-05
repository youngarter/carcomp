"use client";
import React from "react";

interface SpecItemProps {
    label: string;
    value: string | number | null | undefined;
    isLast?: boolean;
}

const SpecItem = ({ label, value, isLast }: SpecItemProps) => {
    return (
        <div className={`flex justify-between items-center py-5 ${!isLast ? 'border-b border-zinc-50' : ''} hover:bg-zinc-50/50 px-3 rounded-xl transition-colors`}>
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{label}</span>
            <span className="text-base font-black text-zinc-900">{value || "—"}</span>
        </div>
    );
};

export default SpecItem;
