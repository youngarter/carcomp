"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Car,
    Image as ImageIcon,
    Settings,
    Users,
    Shield,
    Activity,
    ChevronRight,
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN"]
    },
    {
        title: "Car Inventory",
        href: "/admin/settings/cars",
        icon: Car,
        roles: ["SUPER_ADMIN", "ADMIN"]
    },
    {
        title: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
        roles: ["SUPER_ADMIN", "ADMIN"]
    },
    {
        title: "Security & Roles",
        href: "/admin/settings/roles",
        icon: Shield,
        roles: ["SUPER_ADMIN"]
    },
    {
        title: "User Management",
        href: "/admin/settings/users",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN"]
    },
    {
        title: "Audit Logs",
        href: "/admin/settings/activity",
        icon: Activity,
        roles: ["SUPER_ADMIN"]
    },
    {
        title: "General Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ["SUPER_ADMIN", "ADMIN"]
    }
];

export default function Sidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname();

    const filteredItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <aside className="w-80 min-h-screen bg-white border-r border-zinc-100 flex flex-col sticky top-0">
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                        <Car className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-zinc-900">AutoAdvisor <span className="text-emerald-600">Admin</span></span>
                </Link>

                <nav className="space-y-2">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${isActive
                                        ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100/50"
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-emerald-600" : "group-hover:text-emerald-600"}`} />
                                    <span className="text-sm">{item.title}</span>
                                </div>
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-zinc-50">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-4 p-4 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group font-bold text-sm"
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
