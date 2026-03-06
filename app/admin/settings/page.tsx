import { Shield, Users, Activity, Settings, ChevronRight, Lock, LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

export default async function AdminSettingsPage() {
    const session = await auth();

    const sections = [
        {
            title: "Roles & Permissions",
            description: "Define user boundaries and application security protocols.",
            href: "/admin/settings/roles",
            icon: Shield,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
            roles: ["SUPER_ADMIN"],
        },
        {
            title: "User Management",
            description: "Manage your team, track invitations, and control access.",
            href: "/admin/settings/users",
            icon: Users,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100",
            roles: ["SUPER_ADMIN", "ADMIN"],
        },
        {
            title: "Audit Logs",
            description: "Review system actions and maintain operational transparency.",
            href: "/admin/settings/activity",
            icon: Activity,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100",
            roles: ["SUPER_ADMIN"],
        },
    ];

    return (
        <div className="p-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Préférences Système</span>
                </div>
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Configuration</h1>
                <p className="text-zinc-500 font-medium mt-2">Gérez les accès, les rôles et l'activité de la plateforme.</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {sections.map((section) => {
                    const hasAccess = section.roles.includes(session?.user?.role as string);

                    return (
                        <Link
                            key={section.title}
                            href={hasAccess ? section.href : "#"}
                            className={`group relative flex items-center justify-between p-8 bg-white border rounded-[32px] transition-all duration-300 ${hasAccess
                                ? "border-zinc-100 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 cursor-pointer"
                                : "bg-zinc-50/50 border-zinc-100 opacity-60 cursor-not-allowed"
                                }`}
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 ${hasAccess ? `${section.bgColor} ${section.borderColor} group-hover:scale-110` : "bg-zinc-100 border-zinc-200"
                                    }`}>
                                    <section.icon className={`w-7 h-7 ${hasAccess ? section.color : "text-zinc-400"}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-zinc-900">{section.title}</h3>
                                        {!hasAccess && <Lock className="w-3.5 h-3.5 text-zinc-400" />}
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed font-medium">{section.description}</p>
                                </div>
                            </div>

                            {hasAccess && (
                                <div className="w-10 h-10 rounded-full border border-zinc-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all duration-300">
                                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
