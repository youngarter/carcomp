"use client";

import { useState } from "react";
import { Plus, Shield, Lock, Check, Zap, Info } from "lucide-react";
import EditRoleModal from "./EditRoleModal";
import CreateRoleModal from "./CreateRoleModal";

interface Permission {
    id: string;
    name: string;
}

interface Role {
    id: string;
    name: string;
    permissions: Permission[];
}

export default function RolesClient({
    initialRoles,
    allPermissions
}: {
    initialRoles: Role[];
    allPermissions: Permission[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    return (
        <>
            <header className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white border border-neutral-200 rounded-2xl shadow-sm">
                                <Shield className="w-8 h-8 text-neutral-900" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Access Control</h1>
                        </div>
                        <p className="text-neutral-500 text-lg">Define security boundaries and member capabilities.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-6 py-3 bg-[#171717] hover:bg-neutral-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-neutral-200 flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        New Access Level
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialRoles.map((role) => (
                    <div
                        key={role.id}
                        className="group relative bg-white border border-neutral-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:border-neutral-300 hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-1"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-[#171717] group-hover:text-white transition-all duration-300">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div className="p-2 border border-neutral-100 rounded-xl">
                                    <Lock className={`w-4 h-4 ${role.name === 'SUPER_ADMIN' ? 'text-indigo-500' : 'text-neutral-200'}`} />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black tracking-tight text-neutral-900 mb-2 uppercase">{role.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <p className="text-neutral-400 text-[10px] font-black tracking-widest uppercase">Clearance Verified</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em]">
                                    <Zap className="w-3.5 h-3.5" />
                                    Permissions
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((p) => (
                                        <span
                                            key={p.id}
                                            className="px-3 py-1 bg-neutral-50 border border-neutral-100 rounded-lg text-[9px] font-bold text-neutral-500 uppercase tracking-tighter"
                                        >
                                            {p.name.replace('_', ' ')}
                                        </span>
                                    ))}
                                    {role.permissions.length === 0 && (
                                        <span className="text-[10px] text-neutral-300 italic font-medium">No assigned functionality</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-neutral-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    {role.permissions.length} Active
                                </div>
                                <button
                                    onClick={() => setEditingRole(role)}
                                    className="text-sm font-black text-neutral-900 border-b-2 border-transparent hover:border-neutral-900 transition-all"
                                >
                                    Edit Role
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div
                    onClick={() => setIsCreateOpen(true)}
                    className="border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center hover:border-neutral-400 hover:bg-white transition-all cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#171717] group-hover:text-white transition-all">
                        <Plus className="w-6 h-6 text-neutral-300" />
                    </div>
                    <p className="text-neutral-900 font-bold text-sm tracking-tight mb-1">Add Access Tier</p>
                    <p className="text-neutral-400 text-xs text-balance">Architect a new clearance level</p>
                </div>
            </div>

            {isCreateOpen && (
                <CreateRoleModal onClose={() => setIsCreateOpen(false)} />
            )}

            {editingRole && (
                <EditRoleModal
                    role={editingRole}
                    allPermissions={allPermissions}
                    onClose={() => setEditingRole(null)}
                />
            )}
        </>
    );
}
