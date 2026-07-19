// src/app/user/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { handleLogoutAction } from '@/app/actions/authActions';
import UserFormClient from './UserFormClient';
import { LogOut, LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  
  if (!token) redirect('/auth/login');
  
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') redirect('/auth/login');
  } catch {
    redirect('/auth/login');
  }

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
        <div className="absolute top-[-10%] left-[-20%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] bg-white/[0.02] blur-[130px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-4 sm:space-y-6 z-10">
        
        {/* RESPONSIVE TOP BAR */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border border-neutral-800 bg-neutral-950/60 p-4 sm:p-6 backdrop-blur-xl rounded-2xl gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.02] rounded-xl shrink-0">
              <LayoutDashboard className="h-5 w-5 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-100">Operator Workspace</h1>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Node Connection: <span className="text-neutral-300 font-mono">{decoded.phoneNumber}</span>
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

        {/* WORKSPACE DATA CARD CONTAINER */}
        <section className="border border-neutral-800 bg-neutral-950/40 p-5 sm:p-8 backdrop-blur-2xl rounded-2xl shadow-2xl">
          <div className="mb-6 border-b border-neutral-900 pb-5">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">Lead Status Registry Form</h2>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Input incoming caller metrics, account statuses, and duration parameters directly into the database node.</p>
          </div>

          <UserFormClient />
        </section>

      </div>
    </main>
  );
}