"use client";

import React, { useState, useEffect } from "react";
import { Car, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import UserMenu from "@/components/admin/UserMenu";

const Header = () => {
    const { isMenuOpen, setIsMenuOpen } = useStore();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Compare Cars", href: "/car/compare" },
        { name: "Brands", href: "/#brands" },
        { name: "AI Advisor", href: "/car/diagnostic" },
        { name: "Reviews", href: "/#reviews" },
    ];

    const isLoadingAuth = status === "loading";

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white ${scrolled ? "shadow-sm border-b border-zinc-200" : "border-b border-zinc-100"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <span className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">
                                AUTO<span className="text-emerald-500">ADVISOR</span>
                            </span>
                        </Link>

                        {/* Center Nav */}
                        <div className="hidden md:flex items-center gap-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[13px] font-bold transition-all relative py-2 ${pathname === link.href ? "text-emerald-600" : "text-zinc-600 hover:text-zinc-900"}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-6">
                            <button className="p-2 text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
                                <Search className="w-5 h-5" />
                            </button>

                            {isLoadingAuth ? (
                                <div className="w-10 h-10 bg-zinc-100 animate-pulse rounded-full" />
                            ) : session?.user ? (
                                <UserMenu user={session.user as any} />
                            ) : (
                                <button
                                    onClick={() => signIn()}
                                    className="text-[13px] font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
                                >
                                    Login
                                </button>
                            )}

                            <Link
                                href="/car/compare"
                                className="px-6 py-3 rounded-full bg-zinc-900 text-white text-[12px] font-bold hover:bg-zinc-800 transition-all shadow-md active:scale-95"
                            >
                                Compare Cars
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
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
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => signIn()}
                                        className="w-full py-6 rounded-3xl bg-zinc-900 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-zinc-200"
                                    >
                                        Login
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
