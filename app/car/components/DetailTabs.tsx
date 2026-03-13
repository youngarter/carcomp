"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
}

interface DetailTabsProps {
    tabs: Tab[];
}

export default function DetailTabs({ tabs }: DetailTabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="w-full">
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
                                layoutId="detailTabIndicator"
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
                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full"
                    >
                        {tabs[activeTab].content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
