"use client";

import React from "react";
import { Car, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../../../store/useStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import UserMenu from "@/components/admin/UserMenu";

const Header = () => {
    const { isMenuOpen, setIsMenuOpen } = useStore();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const navLinks = [
        { name: "Catalogue", href: "/" },
        { name: "Diagnostic IA", href: "/car/diagnostic" },
        { name: "Comparateur", href: "/car/compare" },
    ];

    const isLoadingAuth = status === "loading";

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-3xl border-b border-black/[0.03]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <span className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">
                                AUTO<span className="text-emerald-500">ADVISOR</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[12px] font-bold transition-all relative py-2 ${pathname === link.href ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-900"}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            {isLoadingAuth ? (
                                <div className="w-32 h-12 bg-zinc-50 animate-pulse rounded-2xl" />
                            ) : session?.user ? (
                                <UserMenu user={session.user as any} />
                            ) : (
                                <Link
                                    href="/car/diagnostic"
                                    className="px-8 py-4 rounded-xl bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-md active:scale-95"
                                >
                                    DIAGNOSTIC IA
                                </Link>
                            )}
                        </div>

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-3 bg-zinc-50 rounded-xl text-zinc-900">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="md:hidden fixed inset-0 z-40 bg-white pt-32 px-8"
                    >
                        <div className="flex flex-col gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-4xl font-black tracking-tight ${pathname === link.href ? "text-emerald-600" : "text-zinc-900"}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-zinc-100 my-4" />
                            {session?.user ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-3xl">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black">
                                            {session.user.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-black text-zinc-900">{session.user.name || "User Account"}</p>
                                            <p className="text-xs font-bold text-zinc-400 lowercase">{session.user.email}</p>
                                        </div>
                                    </div>
                                    {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full py-6 rounded-3xl bg-emerald-50 text-emerald-700 text-center font-black uppercase tracking-widest text-xs border border-emerald-100"
                                        >
                                            Accéder au Panel Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full py-6 rounded-3xl bg-red-50 text-red-600 font-black uppercase tracking-widest text-xs border border-red-100"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn()}
                                    className="w-full py-6 rounded-3xl bg-zinc-900 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-zinc-200"
                                >
                                    Se connecter
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
