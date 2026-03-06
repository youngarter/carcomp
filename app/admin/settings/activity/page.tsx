import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Activity,
    ChevronLeft,
    Search,
    Filter,
    User,
    Calendar,
    Info,
    ArrowRight,
    Database,
    History
} from "lucide-react";

export default async function ActivityPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        redirect("/admin/settings");
    }

    const logs = await prisma.activityLog.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#171717] font-sans selection:bg-blue-100">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <Link
                        href="/admin/settings"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#171717] transition-colors text-sm font-medium mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                                    <Activity className="w-8 h-8 text-neutral-900" />
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Activity Stream</h1>
                            </div>
                            <p className="text-neutral-500 text-lg">A real-time ledger of all administrative interventions.</p>
                        </div>
                    </div>
                </header>

                {/* Global Toolbar */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 relative group bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-neutral-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search across events..."
                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 outline-none text-sm placeholder:text-neutral-300"
                        />
                    </div>
                    <button className="px-6 py-4 bg-white border border-neutral-200 rounded-2xl text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest shadow-sm">
                        <Filter className="w-4 h-4" />
                        Log Filters
                    </button>
                </div>

                {/* Custom Timeline */}
                <div className="space-y-4 relative">
                    <div className="absolute left-10 top-0 bottom-0 w-px bg-neutral-200 pointer-events-none" />

                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="group relative flex items-start gap-8 p-8 bg-white border border-neutral-200 rounded-[2.5rem] transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 hover:border-neutral-300"
                        >
                            <div className="relative z-10 w-4 h-4 rounded-full bg-white border-4 border-neutral-100 group-hover:border-neutral-900 transition-colors duration-300 mt-5 shrink-0" />

                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-neutral-500">
                                            {log.action.replace('_', ' ')}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-black text-neutral-300 tracking-tighter uppercase tabular-nums">
                                        Entry: {log.id.slice(-12)}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-6 text-sm">
                                    <div className="flex items-center gap-3 py-2 px-4 bg-neutral-50 border border-neutral-100 rounded-2xl w-fit group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white transition-all duration-300">
                                        <div className="w-6 h-6 rounded-lg bg-neutral-200 group-hover:bg-white/10 flex items-center justify-center text-[10px] font-black text-neutral-500 group-hover:text-white transition-colors">
                                            {log.user.name?.[0] || 'S'}
                                        </div>
                                        <span className="font-bold tracking-tight">{log.user.name || 'System'}</span>
                                    </div>
                                    <p className="text-neutral-500 border-l-2 border-neutral-100 pl-4 py-1 leading-relaxed font-medium italic group-hover:text-neutral-900 group-hover:border-neutral-900 transition-colors duration-300">
                                        "{log.details}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {logs.length === 0 && (
                        <div className="p-32 text-center bg-white border border-neutral-200 rounded-[3rem] shadow-sm">
                            <History className="w-12 h-12 text-neutral-200 mx-auto mb-6" />
                            <p className="text-neutral-400 font-black uppercase tracking-[0.2em] text-[10px]">No ledger entries discovered</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 flex gap-6 max-w-3xl mx-auto backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Info className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-neutral-900 mb-1 tracking-tight">Immutable Record-keeping</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed italic">
                            Activity logs serve as a permanent record of system changes. Entries cannot be altered or removed manually, ensuring complete auditability and forensic trace capability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
