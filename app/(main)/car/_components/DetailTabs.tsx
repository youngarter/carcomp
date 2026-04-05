"use client";
import React, { useState, useCallback, useRef } from "react";
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
    const tabListRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            let newIndex = activeTab;
            if (e.key === "ArrowRight") {
                e.preventDefault();
                newIndex = (activeTab + 1) % tabs.length;
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                newIndex = (activeTab - 1 + tabs.length) % tabs.length;
            } else if (e.key === "Home") {
                e.preventDefault();
                newIndex = 0;
            } else if (e.key === "End") {
                e.preventDefault();
                newIndex = tabs.length - 1;
            }

            if (newIndex !== activeTab) {
                setActiveTab(newIndex);
                // Focus the new tab button
                const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
                buttons?.[newIndex]?.focus();
            }
        },
        [activeTab, tabs.length]
    );

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div
                ref={tabListRef}
                role="tablist"
                aria-label="Sections du véhicule"
                onKeyDown={handleKeyDown}
                className="flex gap-2 sm:gap-2 mb-6 sm:mb-8 border-b border-zinc-100 pb-4 overflow-x-auto no-scrollbar scroll-smooth"
            >
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.id}
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={activeTab === idx}
                        aria-controls={`tabpanel-${tab.id}`}
                        tabIndex={activeTab === idx ? 0 : -1}
                        onClick={() => setActiveTab(idx)}
                        className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 px-5 py-4 sm:px-8 sm:py-5 rounded-2xl text-[10px] sm:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] whitespace-nowrap transition-all duration-300 min-w-[80px] sm:min-w-0 ${activeTab === idx
                            ? "text-emerald-600 bg-emerald-50/50"
                            : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                            }`}
                    >
                        {tab.icon && (
                            <span className={`flex-shrink-0 transition-transform duration-300 ${activeTab === idx ? "scale-110" : "scale-100 opcaity-70"}`}>
                                {tab.icon}
                            </span>
                        )}
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:text-[8px] sm:hidden leading-none font-black">
                            {tab.label.split(" ")[0]}
                        </span>
                        {activeTab === idx && (
                            <motion.div
                                layoutId="detailTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full"
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
                        role="tabpanel"
                        id={`tabpanel-${tabs[activeTab].id}`}
                        aria-labelledby={`tab-${tabs[activeTab].id}`}
                        tabIndex={0}
                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full focus:outline-none"
                    >
                        {tabs[activeTab].content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
