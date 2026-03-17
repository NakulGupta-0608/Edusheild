"use client";

import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Eye, CheckCircle2 } from "lucide-react";

export default function AdminComplaints() {
  return (
    <div className="max-w-6xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Grievance Portal</h2>
          <p className="text-slate-500 mt-1">Review and manage complaints submitted by students and the public.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button className="px-4 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Pending Review (2)</button>
        <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Under Investigation</button>
        <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Resolved</button>
      </div>

      <div className="grid gap-6">
        
        {/* Complaint Card 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border text-left border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.05)] rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-10 w-10 flex-shrink-0 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">High Severity: Fire Safety</span>
                <h3 className="text-lg font-bold text-slate-900">No fire exits in basement classrooms</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <MapPin className="h-4 w-4" /> Apex Classes, Sector 14, Gurugram
                </div>
              </div>
            </div>
            <span className="text-sm font-medium text-slate-500">2 hours ago</span>
          </div>
          
          <div className="pl-13 text-slate-700 text-sm border-l-2 border-slate-100 ml-5 pl-4 py-2 mb-6">
            "They are running classes for 150 students in the basement. There is only one narrow staircase and no secondary fire escape. The ventilation is also extremely poor."
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-900">Reporter:</span>
              <span className="text-slate-500 italic">Anonymous Student</span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                <Eye className="h-4 w-4" /> View Evidence
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition-colors shadow-sm">
                Initiate Raid / Notice
              </button>
            </div>
          </div>
        </motion.div>

        {/* Complaint Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border text-left border-amber-200 shadow-sm rounded-2xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-10 w-10 flex-shrink-0 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">Medium: Overcrowding</span>
                <h3 className="text-lg font-bold text-slate-900">Packing 80 students in a 40 capacity room</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <MapPin className="h-4 w-4" /> Pioneer Institute, Kota
                </div>
              </div>
            </div>
            <span className="text-sm font-medium text-slate-500">Yesterday</span>
          </div>
          
          <div className="pl-13 text-slate-700 text-sm border-l-2 border-slate-100 ml-5 pl-4 py-2 mb-6">
            "The institute registered their capacity as 40 for Room A, but they regularly pack 80 students inside. Students are sitting on the floor behind the desks."
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-900">Reporter:</span>
              <span className="text-slate-500">Rahul Verma (Parent)</span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                <CheckCircle2 className="h-4 w-4" /> Mark Investigated
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors shadow-sm">
                Issue Warning
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
