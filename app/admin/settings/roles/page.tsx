import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import RolesClient from "./RolesClient";
import { ensurePermissions } from "@/lib/actions/admin";

export default async function RolesPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
        redirect("/admin/settings");
    }

    // Ensure system permissions exist
    await ensurePermissions();

    const roles = await prisma.role.findMany({
        include: { permissions: true },
        orderBy: { createdAt: 'desc' },
    });

    const allPermissions = await prisma.permission.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#171717] font-sans selection:bg-blue-100">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <header className="mb-8">
                    <Link
                        href="/admin/settings"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#171717] transition-colors text-sm font-medium mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </header>

                <RolesClient initialRoles={roles} allPermissions={allPermissions} />

                {/* Security Notice */}
                <div className="mt-20 bg-white border border-neutral-200 rounded-[2rem] p-8 flex gap-6 max-w-3xl mx-auto shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Info className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-neutral-900 mb-2 tracking-tight">Governance Protocol</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed italic text-balance">
                            Permissions defined within this console are propagated instantly across the global infrastructure. ensure sessions are verified before making hierarchical adjustments to root-level roles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
