"use client";

import React, { useState, useRef } from "react";
import { Camera, X, UploadCloud } from "lucide-react";

interface ImageUploaderProps {
    label: string;
    name: string;
    currentImage?: string | null;
    onFileSelect?: (file: File | null) => void;
    aspectRatio?: "square" | "video" | "auto";
}

export default function ImageUploader({
    label,
    name,
    currentImage,
    onFileSelect,
    aspectRatio = "square"
}: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            if (onFileSelect) onFileSelect(file);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onFileSelect) onFileSelect(null);
    };

    const aspectClass = aspectRatio === "square" ? "aspect-square" : aspectRatio === "video" ? "aspect-video" : "aspect-auto";

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">
                {label}
            </label>

            <div
                className={`relative group rounded-3xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-emerald-500/50 transition-all overflow-hidden ${aspectClass}`}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-white rounded-2xl text-zinc-900 hover:scale-110 transition-transform shadow-xl"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={clearImage}
                                className="p-3 bg-red-500 rounded-2xl text-white hover:scale-110 transition-transform shadow-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full flex flex-col items-center justify-center gap-3 text-zinc-400 hover:text-emerald-600 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <div className="text-center px-4">
                            <p className="text-[10px] font-black uppercase tracking-widest">Cliquez pour uploader</p>
                            <p className="text-[8px] font-medium opacity-60 mt-1">PNG, JPG ou WebP (Max 5MB)</p>
                        </div>
                    </button>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
