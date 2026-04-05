"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getHeroSlides } from "@/lib/actions/hero.actions";

const HeroCarousel = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSlides() {
            try {
                const data = await getHeroSlides();
                // If no slides or all inactive, fallback could be added here, but we'll assume there are active slides
                setSlides(data.filter((s: any) => s.isActive));
            } catch (error) {
                console.error("Failed to load slides", error);
            } finally {
                setLoading(false);
            }
        }
        loadSlides();
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
        Autoplay({ delay: 6000, stopOnInteraction: false })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    if (loading) {
        return (
            <section className="relative w-full h-[80vh] min-h-[600px] bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </section>
        );
    }

    if (slides.length === 0) return null;

    return (
        <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-zinc-950">
            <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                <div className="flex w-full h-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] w-full h-full">
                            {/* Background Image full screen */}
                            <div className="absolute inset-0 z-0 bg-zinc-900">
                                <Image
                                    src={slide.image}
                                    alt={slide.imageAlt || slide.title}
                                    fill
                                    priority={index === 0}
                                    sizes="100vw"
                                    className="object-cover opacity-80 mix-blend-lighten select-none"
                                />
                                {/* Premium Gradient Overlay for Readability */}
                                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent" />
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" /> */}
                            </div>

                            <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 xl:max-w-[1600px] xl:mx-auto">
                                <AnimatePresence mode="wait">
                                    {selectedIndex === index && (
                                        <motion.div
                                            key={slide.id}
                                            initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                                            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                                            className="max-w-3xl text-white pt-20"
                                        >
                                            <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
                                                {slide.brandLogo && (
                                                    <Image src={slide.brandLogo} alt={`${slide.title} Logo`} width={120} height={20} className="h-5 w-auto object-contain brightness-0 invert" />
                                                )}
                                                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                                                    {slide.subtitle}
                                                </span>
                                            </div>

                                            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-6 drop-shadow-2xl">
                                                {slide.title}
                                            </h1>

                                            <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-xl leading-relaxed mb-10 drop-shadow-md">
                                                {slide.description}
                                            </p>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
                                                <Link
                                                    href={slide.url || "/car/compare"}
                                                    className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-emerald-500 text-white font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] active:scale-95"
                                                >
                                                    Découvrir <ChevronRight className="w-5 h-5" />
                                                </Link>

                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">
                                                        Prix de départ
                                                    </span>
                                                    <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
                                                        {slide.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute right-8 bottom-8 md:right-12 md:bottom-20 z-20 flex gap-4">
                <button
                    onClick={scrollPrev}
                    className="w-14 h-14 rounded-full border border-white/20 bg-black/30 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 hover:border-white/40 transition-all active:scale-95"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={scrollNext}
                    className="w-14 h-14 rounded-full border border-white/20 bg-black/30 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 hover:border-white/40 transition-all active:scale-95"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute left-6 sm:left-12 md:left-20 xl:left-auto xl:ml-32 bottom-8 md:bottom-20 flex gap-3 z-20 items-center">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`transition-all duration-500 rounded-full ${index === selectedIndex
                            ? "w-12 h-2.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                            : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Bottom Gradient for smooth transition to next section */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FDFDFF] to-transparent z-10 pointer-events-none" /> */}
        </section>
    );
};

export default HeroCarousel;
