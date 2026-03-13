"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
}

interface AutoSlidingTabsProps {
    tabs: Tab[];
    intervalMs?: number;
}

export default function AutoSlidingTabs({ tabs, intervalMs = 6000 }: AutoSlidingTabsProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % tabs.length);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [tabs.length, intervalMs, isHovered]);

    return (
        <div
            className="w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 border-b border-zinc-100 pb-2 overflow-x-auto no-scrollbar">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(idx)}
                        className={`relative flex items-center gap-3 px-8 py-5 rounded-2xl text-base font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${activeTab === idx
                                ? "text-emerald-600 bg-emerald-50/50"
                                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                            }`}
                    >
                        {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
                        {tab.label}
                        {activeTab === idx && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full translate-y-2"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full"
                    >
                        {tabs[activeTab].content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
