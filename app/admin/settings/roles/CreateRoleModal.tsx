"use client";

import { useState } from "react";
import { createRole } from "@/lib/actions/admin";
import { Plus, Loader2, X, Shield } from "lucide-react";

export default function CreateRoleModal({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const result = await createRole(name);
            if (result.success) {
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create role");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Plus className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-neutral-900 tracking-tight">New Clearance</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-300 hover:text-neutral-900 p-2 hover:bg-neutral-50 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Role Designation</label>
                        <div className="relative group">
                            <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Content Moderator"
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300 font-bold"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading || !name.trim()}
                        className="w-full py-4 bg-[#171717] hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-300 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-neutral-200 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Architect Role"}
                    </button>
                </form>
            </div>
        </div>
    );
}
