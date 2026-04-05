import { signupFromInvitation } from "@/lib/actions/auth.actions";
import { UserPlus, Lock, User as UserIcon, ShieldCheck, ChevronRight } from "lucide-react";

export default async function SignupPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = (await searchParams).token;

    if (!token) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 text-neutral-900 font-sans">
                <div className="max-w-md w-full bg-white border border-neutral-200 rounded-[3rem] p-12 text-center shadow-xl shadow-neutral-200/50">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-neutral-100">
                        <Lock className="w-8 h-8 text-neutral-300" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight">Access Restricted</h1>
                    <p className="text-neutral-500 leading-relaxed mb-10 text-lg">
                        This invitation link is missing a valid security handshake. Please contact your system administrator.
                    </p>
                    <a href="/" className="inline-block px-10 py-4 bg-[#171717] hover:bg-neutral-800 text-white rounded-2xl transition-all font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-neutral-200">
                        Return to Core
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 text-[#171717] font-sans">
            <div className="max-w-md w-full">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[9px] font-black uppercase tracking-widest shadow-sm mb-8">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Clearance Activation
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter mb-4 text-neutral-900">Secure Setup</h1>
                    <p className="text-neutral-400 text-lg font-medium">Finalize your system profile to begin operations.</p>
                </div>

                <form action={signupFromInvitation} className="bg-white border border-neutral-200 rounded-[3rem] p-12 shadow-2xl shadow-neutral-200/50 space-y-10">
                    <input type="hidden" name="token" value={token} />

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Assigned Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                name="name"
                                required
                                type="text"
                                placeholder="Full operational name"
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Access Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                name="password"
                                required
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300 tracking-widest font-bold"
                            />
                        </div>
                        <p className="text-[10px] text-neutral-400 ml-1 italic font-medium">Minimum requirements: 8+ characters, complex string.</p>
                    </div>

                    <button className="w-full py-5 bg-[#171717] hover:bg-neutral-800 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-neutral-200 flex items-center justify-center gap-3 group">
                        Activate Account
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="mt-12 text-center text-xs font-bold text-neutral-300 uppercase tracking-widest">
                    AutoAdvisor Security Protocol v2.0
                </p>
            </div>
        </div>
    );
}
