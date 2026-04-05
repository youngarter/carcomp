"use client";

import React from "react";
import { X } from "lucide-react";
import BrandForm from "./BrandForm";
import { motion, AnimatePresence } from "framer-motion";

interface BrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (brand?: any) => void;
    initialData?: any;
}

export default function BrandModal({ isOpen, onClose, onSuccess, initialData }: BrandModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                                    {initialData ? `Modifier ${initialData.name}` : "Nouvelle Marque"}
                                </h2>
                                <p className="text-zinc-500 font-medium italic mt-1">
                                    {initialData ? "Mettez à jour les informations de la marque." : "Enregistrez une nouvelle marque dans la base."}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <BrandForm
                            initialData={initialData}
                            onSuccess={(brand) => {
                                onSuccess(brand);
                                onClose();
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
