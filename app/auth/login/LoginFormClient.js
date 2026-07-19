'use client';

import { useEffect, useState, useTransition } from 'react';
import { handleLoginAction } from '@/app/actions/authActions';
import {
  LockKeyhole,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Activity,
  LogIn,
} from 'lucide-react';
import { robotoSlab, passero, ubuntu } from '@/lib/fonts';

export default function LoginFormClient() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('username');
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    const currentForm = e.currentTarget;
    const dataPayload = new FormData(currentForm);

    startTransition(async () => {
      const result = await handleLoginAction(dataPayload);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.success && result?.user) {
        localStorage.setItem('phoneNumber', result.user.phoneNumber);
        localStorage.setItem('username', result.user.username);

        window.location.href = result.user.role === 'admin' ? '/admin' : '/user';
      }
    });
  }

  return (
    <main className={`relative flex min-h-screen w-full overflow-x-hidden bg-black ${ubuntu.className} text-white`}>
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* MARKETING SIDE PANEL - Hidden on mobile/tablet, expands on desktop */}
      <section className="relative hidden w-1/2 flex-col justify-between border-r border-white/10 p-12 lg:flex z-10 bg-gradient-to-b from-neutral-950 to-black">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-lg">
              <span className={`${passero.className} text-base font-bold text-white tracking-wider`}>DT</span>
            </div>
            <div>
              <h2 className={`${robotoSlab.className} text-lg font-bold tracking-tight`}>DataTech</h2>
              <p className="text-xs text-neutral-500 font-medium">Enterprise Workspace Suite</p>
            </div>
          </div>

          <div className="mt-16 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-300 rounded-full backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              Premium Secure Access
            </div>
            <h1 className={`${robotoSlab.className} text-5xl font-black leading-[1.1] tracking-tight text-neutral-100`}>
              Built for modern teams that move fast.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-neutral-400">
              Centralized workspace platform designed for secure operations, analytics, workflow automation, and high-performance team management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-white/5 bg-white/[0.01] p-5 backdrop-blur-md rounded-xl">
            <ShieldCheck className="h-5 w-5 text-white mb-3" />
            <h3 className="text-sm font-semibold text-neutral-200">Secure Infrastructure</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              Protected access with encrypted authentication and role-based layers.
            </p>
          </div>
          <div className="border border-white/5 bg-white/[0.01] p-5 backdrop-blur-md rounded-xl">
            <ChevronRight className="h-5 w-5 text-white mb-3" />
            <h3 className="text-sm font-semibold text-neutral-200">High-Speed Workflow</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
              Optimized dashboard experience built for fast execution.
            </p>
          </div>
        </div>
      </section>

      {/* LOGIN BOX - Mobile First Container */}
      <section className="relative flex w-full flex-col justify-center items-center px-4 py-8 sm:px-6 md:px-12 lg:w-1/2 z-10">
        <div className="w-full max-w-md">
          {/* Header for Mobile display */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/[0.02] rounded-lg">
              <span className={`${passero.className} text-sm font-bold`}>DT</span>
            </div>
            <span className={`${robotoSlab.className} font-bold tracking-tight text-neutral-200`}>DataTech Suite</span>
          </div>

          {/* MAIN FORM BOX */}
          <div className="relative overflow-hidden border border-neutral-800 rounded-2xl bg-neutral-950/60 shadow-2xl backdrop-blur-xl w-full">
            <div className="p-6 sm:p-10">
              
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className={`${robotoSlab.className} text-2xl font-bold tracking-tight text-white`}>Welcome</h2>
                    <p className="text-xs text-neutral-500 font-medium">Login to access workspace portal</p>
                  </div>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {error && (
                  <div className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400 rounded-lg backdrop-blur-md">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="phoneNumber" className="text-xs font-semibold tracking-wide text-neutral-400">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-white">
                      <Phone size={16} />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      disabled={isPending}
                      placeholder="9876543210"
                      className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/40 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-neutral-900/90 focus:ring-4 focus:ring-white/[0.02] disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-semibold tracking-wide text-neutral-400">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-white">
                      <LockKeyhole size={16} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={isPending}
                      placeholder="••••••••"
                      className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/40 pl-10 pr-12 text-sm text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-neutral-900/90 focus:ring-4 focus:ring-white/[0.02] disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white rounded-md transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`${passero.className} group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl border border-white bg-transparent font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none`}
                >
                  <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />
                  <span className="relative z-10 flex items-center gap-2 text-lg transition-colors duration-300 group-hover:text-black">
                    {isPending ? (
                      <span className="flex items-center gap-2 text-sm animate-pulse">
                        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        Continue
                        <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 border-t border-white/5 pt-4 flex items-center justify-between text-[11px] font-medium text-neutral-600">
                <span>Secure SSL Line</span>
                <span>© 2026 DataTech</span>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}