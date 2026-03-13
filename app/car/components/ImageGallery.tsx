"use client";
import React, { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
    const [activeImage, setActiveImage] = useState(images[0] || "/placeholder-car.jpg");

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-[16/10] bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-100">
                <Image src="/placeholder-car.jpg" alt={alt} fill className="object-cover" />
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-4">
            <div className="relative aspect-[16/10] bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-100 group">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImage(img)}
                            className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all hover:shadow-md ${activeImage === img ? 'border-emerald-500 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image src={img} alt={`${alt} view ${i + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
