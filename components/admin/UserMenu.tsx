"use client";

import React, { useState } from "react";
import {
    LogOut,
    User,
    Shield,
    ChevronDown,
    Settings,
    Activity
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface UserMenuProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-emerald-500/30 hover:bg-white transition-all group"
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-sm uppercase">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="hidden lg:block text-left pr-2">
                    <p className="text-xs font-black text-zinc-900 leading-none mb-1 capitalize">{user.name || "User"}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role?.replace("_", " ") || "Member"}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50 p-3 z-[70] overflow-hidden"
                        >
                            <div className="p-4 mb-2">
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-sm font-black text-zinc-900 truncate">{user.email}</p>
                            </div>

                            <div className="space-y-1">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-4 rounded-xl text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all font-bold text-sm group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <span>Admin Panel</span>
                                    </Link>
                                )}

                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-4 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-bold text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span>My Profile</span>
                                </Link>

                                <div className="h-px bg-zinc-50 my-2 mx-4" />

                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-white transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
