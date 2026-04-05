"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step?: number;
    minGap?: number;
    initialMin?: number;
    initialMax?: number;
    onChange: (min: number, max: number) => void;
}

const PriceRangeSlider = ({
    min,
    max,
    step = 1000,
    minGap = 50000,
    initialMin,
    initialMax,
    onChange
}: PriceRangeSliderProps) => {
    const [minValue, setMinValue] = useState(initialMin ?? min);
    const [maxValue, setMaxValue] = useState(initialMax ?? max);
    const trackRef = useRef<HTMLDivElement>(null);

    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        setMinValue(initialMin ?? min);
    }, [initialMin, min]);

    useEffect(() => {
        setMaxValue(initialMax ?? max);
    }, [initialMax, max]);

    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(event.target.value), maxValue - minGap);
        setMinValue(value);
    };

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(event.target.value), minValue + minGap);
        setMaxValue(value);
    };

    const handleMouseUp = () => {
        onChange(minValue, maxValue);
    };

    return (
        <div className="w-full py-8 px-2">
            <div className="relative h-2 w-full bg-zinc-100 rounded-full mb-8">
                {/* Active Track Highlight */}
                <div
                    className="absolute h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    style={{
                        left: `${getPercent(minValue)}%`,
                        right: `${100 - getPercent(maxValue)}%`
                    }}
                />

                {/* Range Inputs */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    onChange={handleMinChange}
                    onMouseUp={handleMouseUp}
                    className="absolute w-full h-2 pointer-events-none appearance-none bg-transparent m-0 z-20 
                               [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                               [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                               [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-emerald-500 
                               [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:cursor-grab 
                               [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:transition-transform
                               [&::-webkit-slider-thumb]:active:scale-120"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxChange}
                    onMouseUp={handleMouseUp}
                    className="absolute w-full h-2 pointer-events-none appearance-none bg-transparent m-0 z-20 
                               [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                               [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                               [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-emerald-600 
                               [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:cursor-grab 
                               [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:transition-transform
                               [&::-webkit-slider-thumb]:active:scale-120"
                />
            </div>

            {/* Price Labels */}
            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Min</span>
                    <span className="text-sm font-black text-zinc-900">
                        {minValue.toLocaleString("fr-FR")} <span className="text-[10px] text-zinc-400 ml-0.5">DH</span>
                    </span>
                </div>
                <div className="h-8 w-px bg-zinc-200" />
                <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Max</span>
                    <span className="text-sm font-black text-zinc-900">
                        {maxValue.toLocaleString("fr-FR")} <span className="text-[10px] text-zinc-400 ml-0.5">DH</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
