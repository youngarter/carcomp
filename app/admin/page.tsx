import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Clock,
    Zap
} from "lucide-react";
import prisma from "@/app/lib/db";

export default async function AdminPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        redirect("/");
    }

    const stats = [
        { label: "Total Models", value: await prisma.carModel.count(), icon: LayoutDashboard, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Finitions", value: await prisma.finition.count({ where: { isDeadModel: false } }), icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Total Brands", value: await prisma.brand.count(), icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const recentActivity = await prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } }
    });

    return (
        <div className="p-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Tableau de Bord</span>
                </div>
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                    Bonjour, <span className="text-emerald-600 italic font-medium">{session.user.name}</span>
                </h1>
                <p className="text-zinc-500 font-medium mt-2">Bienvenue dans votre interface de gestion AutoAdvisor AI.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>LIVE</span>
                            </div>
                        </div>
                        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8">
                        <TrendingUp className="w-24 h-24 text-zinc-50 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-2 relative z-10">Activité Récente</h3>
                    <p className="text-zinc-500 text-sm font-medium mb-8 relative z-10">Suivez les dernières modifications sur la plateforme.</p>

                    <div className="space-y-6 relative z-10">
                        {recentActivity.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-zinc-400 font-medium italic text-sm">Aucune activité récente.</p>
                            </div>
                        ) : recentActivity.map((log) => (
                            <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-50 hover:bg-zinc-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-zinc-900 leading-tight mb-0.5 truncate">{log.action.replace("_", " ")}</p>
                                    <p className="text-xs text-zinc-500 truncate">{log.details}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{log.user.name}</p>
                                        <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                                            {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 p-12 rounded-[40px] text-white flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Sécurité Système</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed max-w-sm mb-8">
                            Votre session est protégée avec un accès de niveau <span className="text-white font-bold">{session.user.role}</span>. Toutes les actions sont tracées.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button className="px-6 py-3 bg-white text-zinc-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                            Voir les logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Activity } from "lucide-react";
