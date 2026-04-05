"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { ImageOff, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
    const validImages = images.filter((img) => img && img.trim() !== "");
    const [activeImage, setActiveImage] = useState(validImages[0] || "");
    const [imgError, setImgError] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleThumbnailClick = useCallback((img: string) => {
        setActiveImage(img);
        setImgError(false);
    }, []);

    if (!validImages.length) {
        return (
            <div className="relative aspect-[16/10] bg-zinc-50 rounded-2xl sm:rounded-[3rem] overflow-hidden border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-4">
                <ImageOff className="w-12 h-12 text-zinc-300" />
                <p className="text-sm font-bold text-zinc-400">Aucune image disponible</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
            {/* Main Image Container */}
            <div
                className="relative aspect-[16/10] bg-white rounded-2xl sm:rounded-[4rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.1)] border border-zinc-100 group cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
            >
                {imgError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 gap-3">
                        <ImageOff className="w-10 h-10 text-zinc-300" />
                        <p className="text-xs font-bold text-zinc-400">Image indisponible</p>
                    </div>
                ) : (
                    <>
                        <Image
                            src={activeImage}
                            alt={alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                            onError={() => setImgError(true)}
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-900 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <Maximize2 className="w-6 h-6" />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 px-2 sm:px-0">
                    {validImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => handleThumbnailClick(img)}
                            aria-label={`Voir image ${i + 1} de ${alt}`}
                            className={`relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === img
                                ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg scale-105 z-10"
                                : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${alt} vue ${i + 1}`}
                                fill
                                sizes="(max-width: 768px) 25vw, 20vw"
                                className="object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-4 sm:p-10"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLightboxOpen(false);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-video rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={activeImage}
                                alt={alt}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;
