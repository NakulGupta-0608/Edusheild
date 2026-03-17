"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Search, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

interface Institute {
  id: string;
  instituteId: string;
  name: string;
  city: string;
  capacityPercentage: number;
  currentlyEnrolled: number;
  maxAllowed: number;
  riskStatus: string;
}

export default function AdminInstitutes() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await fetch('/api/institutes/admin');
        const json = await res.json();
        if (json.success) {
          setInstitutes(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch institutes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Institute Registry</h2>
          <p className="text-slate-500 mt-1">Manage all registered coaching centers and review AI infrastructure flags.</p>
        </div>
        <Link 
          href="/admin/register-institute"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          New Registration
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search institutes by name or ID..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
        <select className="border border-slate-200 bg-slate-50 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Statuses</option>
          <option>Verified</option>
          <option>High Risk</option>
          <option>Pending AI Scan</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Institute</th>
                <th className="px-6 py-4">Capacity Status</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-500">Loading institutes...</p>
                  </td>
                </tr>
              ) : institutes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No registered institutes found.
                  </td>
                </tr>
              ) : (
                institutes.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${inst.riskStatus === 'UNSAFE' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{inst.name}</p>
                          <p className="text-xs text-slate-500">{inst.instituteId}  •  {inst.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                        <div className={`h-2 rounded-full ${inst.capacityPercentage > 100 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(inst.capacityPercentage, 100)}%` }}></div>
                      </div>
                      <span className={`text-xs font-medium ${inst.capacityPercentage > 100 ? 'text-red-600' : 'text-slate-600'}`}>
                        {inst.capacityPercentage}% Capacity {inst.capacityPercentage > 100 ? '(Over)' : '(Safe)'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {inst.riskStatus === 'SAFE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <ShieldCheck className="h-3 w-3" />
                          Verified Safe
                        </span>
                      )}
                      {inst.riskStatus === 'UNSAFE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          High Risk Flag
                        </span>
                      )}
                      {inst.riskStatus === 'WARNING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          Warning
                        </span>
                      )}
                      {inst.riskStatus === 'PENDING_REGISTRATION' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Review Profile</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
