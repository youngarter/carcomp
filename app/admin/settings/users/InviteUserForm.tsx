"use client";

import { useState } from "react";
import { createInvitation } from "@/lib/actions/admin.actions";
import { Mail, Loader2, X, UserCheck } from "lucide-react";

export default function InviteUserForm({ roles }: { roles: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const roleId = formData.get("roleId") as string;

        try {
            const result = await createInvitation(email, roleId);
            if (result.success) {
                setSuccess(true);
                setToken(result.token);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create invitation");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-[#171717] hover:bg-neutral-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-neutral-200 flex items-center gap-2 group"
            >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Invite New Member
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-neutral-900 tracking-tight">Access Invite</h2>
                    </div>
                    <button onClick={() => { setIsOpen(false); setSuccess(false); }} className="text-neutral-300 hover:text-neutral-900 p-2 hover:bg-neutral-50 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                            <UserCheck className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black text-neutral-900 mb-2">Member Invited!</h3>
                        <p className="text-neutral-500 text-sm mb-8 leading-relaxed italic">
                            Credential grant successfully initialized. System documentation link generated for testing purposes:
                        </p>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 break-all text-[10px] font-mono mb-8 text-blue-600 font-bold tracking-tight">
                            {window.location.origin}/auth/signup?token={token}
                        </div>
                        <button
                            onClick={() => { setIsOpen(false); setSuccess(false); }}
                            className="w-full py-4 bg-[#171717] hover:bg-neutral-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            Finalize
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Identity (Email)</label>
                            <input
                                name="email"
                                required
                                type="email"
                                placeholder="colleague@autoadvisor.ma"
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Clearance Tier</label>
                            <div className="relative">
                                <select
                                    name="roleId"
                                    required
                                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 px-5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none text-neutral-900 font-bold"
                                >
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-300">
                                    <ChevronLeft className="w-4 h-4 -rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-100 disabled:text-neutral-300 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Generate Access Grant
                                    <Mail className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
import { ChevronLeft } from "lucide-react";
