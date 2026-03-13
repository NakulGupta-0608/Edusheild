"use client";

import { useState } from "react";
import { Search, ShieldCheck, MapPin, Building2, AlertTriangle, ArrowLeft, Filter, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PublicDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock public data
  const institutes = [
    { id: "INS-1048", name: "Bright Minds Academy", location: "Mumbai, Maharashtra", status: "Verified", safe: true, capacity: "Available", courses: "JEE, NEET", rating: 4.8 },
    { id: "INS-1047", name: "Pioneer Classes", location: "Kota, Rajasthan", status: "Verified", safe: true, capacity: "Full", courses: "Foundation, JEE", rating: 4.9 },
    { id: "INS-0991", name: "Excel Tutorials", location: "Delhi, NCR", status: "Warning", safe: false, capacity: "Available", courses: "Commerce", rating: 3.2, issue: "Pending Fire Safety" },
    { id: "INS-1102", name: "Aakash Institute Branch 4", location: "Bangalore, Karnataka", status: "Verified", safe: true, capacity: "Available", courses: "NEET", rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 flex-col justify-center px-4 md:px-8 sm:flex-row sm:items-center sm:justify-between py-2 sm:py-0">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Public Directory</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search coaching centers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Verified Institutes</h1>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl">
              Browse coaching centers that have been verified by the Ministry of Education for safety, infrastructure, and fair practices.
            </p>
          </div>
          <button className="flex items-center gap-2 w-fit px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes.map((inst, i) => (
            <motion.div 
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 cursor-pointer relative overflow-hidden"
            >
              {/* Top Warning Banner if needed */}
              {!inst.safe && (
                <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1 text-center truncate">
                  Caution: {inst.issue}
                </div>
              )}

              <div className={`flex justify-between items-start mb-4 ${!inst.safe ? 'mt-4' : ''}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${inst.safe ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {inst.safe ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {inst.status}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{inst.name}</h3>
                <div className="flex items-start gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{inst.location}</span>
                </div>
                
                <div className="pt-4 mt-auto border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Courses</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{inst.courses}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Admissions</p>
                    <p className={`text-sm font-bold ${inst.capacity === 'Full' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {inst.capacity}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Profile Button Layer */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/95 backdrop-blur-sm border-t border-emerald-100">
                 <button className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                   View Full Profile
                 </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Can't find banner */}
        <div className="mt-16 rounded-2xl bg-blue-50 border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-blue-900 mb-2">Can't find an institute?</h3>
            <p className="text-blue-700 max-w-lg">If a coaching center is operating but not listed here, it is unregistered and operating illegally. Please report them immediately.</p>
          </div>
          <Link 
            href="/complaint"
            className="relative z-10 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="h-5 w-5" />
            Report Unregistered Center
          </Link>
          
          <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 text-blue-500/10 pointer-events-none" />
        </div>

      </main>
    </div>
  );
}
