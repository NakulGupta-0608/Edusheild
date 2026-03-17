"use client";

import { motion } from "framer-motion";
import { Wrench, Shield } from "lucide-react";

export default function InstituteSettings() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Institute Settings</h2>
        <p className="text-slate-500 mt-1">Manage your coaching center profile and update documents.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-6">
          <Wrench className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Management Coming Soon</h3>
        <p className="text-slate-600 max-w-sm mx-auto mb-6">
          The settings interface to update your infrastructure details and password is currently under construction.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg">
          <Shield className="h-4 w-4" />
          Verified Account
        </div>
      </motion.div>
    </div>
  );
}
