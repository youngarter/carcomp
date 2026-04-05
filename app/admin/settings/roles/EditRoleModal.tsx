"use client";

import { useState } from "react";
import { updateRolePermissions } from "@/lib/actions/admin.actions";
import { Shield, Loader2, X, Check, Zap } from "lucide-react";

interface Permission {
    id: string;
    name: string;
}

interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export default function EditRoleModal({
    role,
    allPermissions,
    onClose
}: {
    role: Role;
    allPermissions: Permission[];
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>(
        role.permissions.map(p => p.id)
    );

    const togglePermission = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    async function handleSave() {
        setLoading(true);
        try {
            const result = await updateRolePermissions(role.id, selectedIds);
            if (result.success) {
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update permissions");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">{role.name}</h2>
                            <p className="text-neutral-400 text-xs font-bold tracking-widest uppercase">Manage Handshakes</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-neutral-300 hover:text-neutral-900 p-2 hover:bg-neutral-50 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                    {allPermissions.map((permission) => {
                        const isSelected = selectedIds.includes(permission.id);
                        return (
                            <button
                                key={permission.id}
                                onClick={() => togglePermission(permission.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left group ${isSelected
                                        ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                        : "bg-white border-neutral-100 hover:border-neutral-200"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? "bg-indigo-600 text-white" : "bg-neutral-50 text-neutral-300 group-hover:bg-neutral-100"}`}>
                                        <Zap className="w-3.5 h-3.5" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-indigo-900" : "text-neutral-400"}`}>
                                        {permission.name.replace('_', ' ')}
                                    </span>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-indigo-600 animate-in zoom-in duration-300" />}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleSave}
                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-100 disabled:text-neutral-300 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
