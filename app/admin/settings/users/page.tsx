import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    UserPlus,
    Clock,
    CheckCircle2,
    MoreVertical,
    Shield,
    ChevronLeft,
    Mail,
    Search,
    Filter,
    User
} from "lucide-react";
import InviteUserForm from "./InviteUserForm";

export default async function UsersPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        redirect("/");
    }

    const users = await prisma.user.findMany({
        include: { role: true },
        orderBy: { createdAt: 'desc' },
    });

    const roles = await prisma.role.findMany();

    const invitations = await prisma.invitation.findMany({
        include: { role: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#171717] font-sans selection:bg-blue-100">
            <div className="max-w-6xl mx-auto px-6 py-12">
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
                                    <UserPlus className="w-8 h-8 text-neutral-900" />
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">User Directory</h1>
                            </div>
                            <p className="text-neutral-500 text-lg">Manage your organization members and access levels.</p>
                        </div>
                        <InviteUserForm roles={roles} />
                    </div>
                </header>

                {/* Global Stats/Search Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white border border-neutral-200 p-6 rounded-[2rem] shadow-sm">
                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Members</div>
                        <div className="text-3xl font-extrabold text-neutral-900">{users.length}</div>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6 rounded-[2rem] shadow-sm">
                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Pending Invitations</div>
                        <div className="text-3xl font-extrabold text-neutral-900">{invitations.length}</div>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="w-full bg-neutral-50 border-none rounded-xl py-3 pl-10 pr-4 outline-none text-sm placeholder:text-neutral-300"
                            />
                        </div>
                        <button className="p-3 bg-neutral-50 rounded-xl text-neutral-400 hover:text-neutral-900 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Pending Invitations Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            Pending Pipeline
                        </h2>
                        <div className="bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                            {invitations.length === 0 ? (
                                <div className="p-20 text-center text-neutral-400">
                                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                    <p className="font-medium">No pending invitations at this time.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-neutral-100 bg-neutral-50/30">
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Recipient Email</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Assigned Role</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Activity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-50">
                                            {invitations.map((inv) => (
                                                <tr key={inv.id} className="group hover:bg-neutral-50/50 transition-colors">
                                                    <td className="px-8 py-6 font-bold text-neutral-900">{inv.email}</td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                                                            {inv.role.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
                                                            <Clock className="w-3 h-3" />
                                                            Expiring Soon
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-md text-neutral-300 hover:text-neutral-900 transition-all border border-transparent hover:border-neutral-100">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Active Users Section */}
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            Active Roster
                        </h2>
                        <div className="bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-neutral-100 bg-neutral-50/30">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Member</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Contact Details</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Security Clearance</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {users.map((u) => (
                                            <tr key={u.id} className="group hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-xs font-black text-white shadow-lg">
                                                            {u.name?.[0] || u.email?.[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-neutral-900 tracking-tight">{u.name || "System Member"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-neutral-500 font-medium italic">{u.email}</td>
                                                <td className="px-8 py-6">
                                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit font-black text-[9px] uppercase tracking-widest shadow-sm ${u.role?.name === 'SUPER_ADMIN'
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white border-neutral-200 text-neutral-900'
                                                        }`}>
                                                        <Shield className={`w-3 h-3 ${u.role?.name === 'SUPER_ADMIN' ? 'text-blue-200' : 'text-neutral-400'}`} />
                                                        {u.role?.name || "Member"}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-md text-neutral-300 hover:text-neutral-900 transition-all border border-transparent hover:border-neutral-100">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
