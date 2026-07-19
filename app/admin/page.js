// src/app/admin/page.js
import { handleGetAllEntries } from '@/app/actions/entryActions';
import { handleLogoutAction } from '@/app/actions/authActions';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User, Mail, Phone, MapPin, LogOut, ShieldAlert, Database, CalendarDays } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) redirect('/auth/login');

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            redirect('/auth/login');
        }
    } catch {
        redirect('/auth/login');
    }

    // Fetch all leads records securely from MongoDB Atlas
    const entries = await handleGetAllEntries();

    async function logout() {
        'use server';
        await handleLogoutAction();
        redirect('/auth/login');
    }

    return (
        <main className="relative min-h-screen bg-[#050505] text-white p-4 sm:p-6 md:p-8 overflow-x-hidden">

            {/* GLOW BACKGROUND BLOCKS */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="absolute bottom-[-10%] right-[-20%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] bg-white/[0.01] blur-[140px] rounded-full" />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-4 sm:space-y-6 z-10">

                {/* RESPONSIVE TOP BAR */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between border border-neutral-800 bg-neutral-950/60 p-4 sm:p-6 backdrop-blur-xl rounded-2xl gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.02] rounded-xl shrink-0">
                            <Database className="h-5 w-5 text-neutral-400" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-100">Central Audit Ledger</h1>
                            <p className="text-xs text-neutral-500 font-medium mt-0.5">
                                Logged Admin: <span className="text-neutral-300 font-mono">{decoded.phoneNumber}</span>
                            </p>
                        </div>
                    </div>

                    <form action={logout} className="w-full sm:w-auto">
                        <button
                            type="submit"
                            className="flex w-full sm:w-auto items-center justify-center gap-2 text-xs font-semibold border border-neutral-800 px-4 py-2.5 rounded-xl bg-white/[0.01] hover:bg-white hover:text-black transition-all duration-200 active:scale-[0.98]"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                        </button>
                    </form>
                </header>

                {/* DATA METRIC CONTAINER */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between pl-1">
                        <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-400">
                            Total Workspace Lead Enrolments ({entries.length})
                        </h2>
                    </div>

                    {entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border border-neutral-800 bg-neutral-950/40 p-12 sm:p-16 rounded-2xl text-center">
                            <ShieldAlert className="h-8 w-8 text-neutral-600 mb-3" />
                            <p className="text-sm text-neutral-500 font-medium">No telemetry entry logs found inside MongoDB database records.</p>
                        </div>
                    ) : (
                        // Mobile First Layout Grid: Stacks on mobile, splits into 2 columns on larger screens
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {entries.map((entry) => (
                                <div
                                    key={entry._id}
                                    className="flex flex-col justify-between border border-neutral-800 bg-neutral-950/40 p-5 sm:p-6 backdrop-blur-2xl rounded-2xl transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-950/70"
                                >
                                    {/* Card Main Metadata Profile Segment */}
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-900 pb-3 mb-4 gap-1.5">
                                            <div className="flex flex-col gap-0.5">
                                                {/* Displays the Operator's Stored Phone Number Node */}
                                                <span>Node: <strong className="text-neutral-300 font-mono">{entry.operatorName}</strong></span>
                                                {/* Statically or dynamically displays the Operator Name context if available */}
                                                {entry.username && (
                                                    <span className="text-neutral-400 font-medium">Operator: <span className="text-neutral-200">{entry.username}</span></span>
                                                )}
                                            </div>
                                            <span className="flex items-center gap-1 self-start sm:self-center">
                                                <CalendarDays className="h-3 w-3" />
                                                Logged: {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Core Client Variable Records */}
                                        <div className="space-y-3 text-sm mb-5">
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 text-neutral-500 shrink-0" />
                                                <span className="font-semibold text-white">{entry.clientName}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-neutral-300">
                                                <Mail className="h-4 w-4 text-neutral-500 shrink-0" />
                                                <span className="truncate text-xs sm:text-sm font-medium">{entry.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-neutral-300">
                                                <Phone className="h-4 w-4 text-neutral-500 shrink-0" />
                                                <span className="font-mono text-xs sm:text-sm">{entry.phoneNo}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-neutral-400">
                                                <MapPin className="h-4 w-4 text-neutral-500 shrink-0" />
                                                <span className="truncate text-xs font-medium">{entry.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calculated Process Dynamic Timeline Block */}
                                    <div className="grid grid-cols-3 gap-1.5 border-t border-neutral-900 pt-4 bg-neutral-950/60 p-3 rounded-xl text-center items-center">
                                        <div>
                                            <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 mb-0.5">Initial End</div>
                                            <div className="text-[11px] sm:text-xs text-neutral-300 font-mono font-semibold">
                                                {new Date(entry.currentEndDate).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 mb-0.5">Extension</div>
                                            <div className="text-[11px] sm:text-xs text-amber-400 font-black">+{entry.extensionDays}D</div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 mb-0.5">New Target</div>
                                            <div className="text-[11px] sm:text-xs text-emerald-400 font-mono font-black">
                                                {new Date(entry.newEndDate).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}