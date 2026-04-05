import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            <Sidebar userRole={session.user.role as string} />
            <main className="flex-1 min-w-0 overflow-auto">
                <div className="max-w-[1400px]  mx-auto min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
