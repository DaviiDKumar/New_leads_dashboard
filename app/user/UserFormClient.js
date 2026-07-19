// src/app/user/UserFormClient.js
'use client';

import { useState, useEffect, useTransition } from 'react';
import { handleCreateEntry } from '@/app/actions/entryActions';
import { User, Mail, Phone, MapPin, Calendar, PlusCircle, ShieldAlert, CheckCircle } from 'lucide-react';

export default function UserFormClient({ operatorUsername }) {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phoneNo: '',
    address: '',
    currentEndDate: '',
    extensionDays: '0',
    newEndDate: '',
    finalReportDate: ''
  });
  
  const [status, setStatus] = useState({ error: '', success: false });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (formData.currentEndDate) {
      const current = new Date(formData.currentEndDate);
      const days = parseInt(formData.extensionDays, 10) || 0;
      current.setDate(current.getDate() + days);
      
      setFormData(prev => ({ 
        ...prev, 
        newEndDate: current.toISOString().split('T')[0] 
      }));
    }
  }, [formData.currentEndDate, formData.extensionDays]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const triggerDataCommit = async () => {
    setStatus({ error: '', success: false });

    if (
      !formData.clientName || 
      !formData.email || 
      !formData.phoneNo || 
      !formData.address || 
      !formData.currentEndDate ||
      !formData.finalReportDate
    ) {
      setStatus({ error: 'All tracking parameters are strictly required to save.', success: false });
      return;
    }

    startTransition(async () => {
      // Append the operator username to the form data payload explicitly
      const commitPayload = {
        ...formData,
        username: operatorUsername
      };

      const result = await handleCreateEntry(commitPayload);
      
      if (result?.error) {
        setStatus({ error: result.error, success: false });
      } else {
        setStatus({ error: '', success: true });
        setFormData({
          clientName: '', email: '', phoneNo: '', address: '',
          currentEndDate: '', extensionDays: '0', newEndDate: '',
          finalReportDate: ''
        });
        
        setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 4000);
      }
    });
  };

  return (
    <div className="space-y-5">
      {/* HUD SYSTEM STATE ALERTS */}
      {status.error && (
        <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 p-4 rounded-xl text-xs font-medium text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}
      
      {status.success && (
        <div className="flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl text-xs font-medium text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Record safely committed and logged into MongoDB Atlas database architecture.</span>
        </div>
      )}

      {/* INPUT GRID FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Client Full Name</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-white">
              <User size={16} />
            </div>
            <input 
              name="clientName" 
              value={formData.clientName} 
              onChange={handleInputChange} 
              disabled={isPending}
              placeholder="John Doe" 
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80 focus:ring-4 focus:ring-white/[0.01]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Client Email Address</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-white">
              <Mail size={16} />
            </div>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              disabled={isPending}
              placeholder="john@example.com" 
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80 focus:ring-4 focus:ring-white/[0.01]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Contact Phone Number</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-white">
              <Phone size={16} />
            </div>
            <input 
              name="phoneNo" 
              value={formData.phoneNo} 
              onChange={handleInputChange} 
              disabled={isPending}
              placeholder="9876543210" 
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80 focus:ring-4 focus:ring-white/[0.01]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Physical Residence Address</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors duration-200 group-focus-within:text-white">
              <MapPin size={16} />
            </div>
            <input 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              disabled={isPending}
              placeholder="Suite 404, City Block" 
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80 focus:ring-4 focus:ring-white/[0.01]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Current Term End Date</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Calendar size={16} />
            </div>
            <input 
              name="currentEndDate" 
              type="date" 
              value={formData.currentEndDate} 
              onChange={handleInputChange} 
              disabled={isPending}
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80 [color-scheme:dark]" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Extension Metric (Days)</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <PlusCircle size={16} />
            </div>
            <input 
              name="extensionDays" 
              type="number" 
              min="0" 
              value={formData.extensionDays} 
              onChange={handleInputChange} 
              disabled={isPending}
              placeholder="0"
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80" 
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[11px] font-semibold tracking-wider text-neutral-400 pl-0.5">Final Report Date</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Calendar size={16} />
            </div>
            <input 
              name="finalReportDate" 
              type="date" 
              value={formData.finalReportDate} 
              onChange={handleInputChange} 
              disabled={isPending}
              className="h-12 w-full border border-white/10 rounded-xl bg-neutral-900/30 pl-10 pr-4 text-sm text-white outline-none transition-all focus:border-white/30 focus:bg-neutral-900/80 [color-scheme:dark]" 
            />
          </div>
        </div>
      </div>

      {/* CALCULATED RESULTS PANEL */}
      {formData.newEndDate && (
        <div className="border border-neutral-800 bg-neutral-950/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Calculated Adjusted Target Date</h4>
            <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">Auto-incremented timeline adjustment configured contextually.</p>
          </div>
          <div className="text-base font-black text-emerald-400 tracking-wide font-mono bg-emerald-500/10 px-4 py-2 border border-emerald-500/20 rounded-xl text-center sm:text-right">
            {new Date(formData.newEndDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="button"
        onClick={triggerDataCommit}
        disabled={isPending}
        className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl border border-white bg-transparent font-bold text-white transition-all hover:scale-[1.005] active:scale-[0.995] disabled:opacity-40 disabled:pointer-events-none"
      >
        <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />
        <span className="relative z-10 flex items-center gap-2 text-sm font-bold transition-colors duration-300 group-hover:text-black">
          {isPending ? (
            <span className="flex items-center gap-2 animate-pulse">
              <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving to Cluster Matrix...
            </span>
          ) : (
            "Commit Record Entry"
          )}
        </span>
      </button>
    </div>
  );
}