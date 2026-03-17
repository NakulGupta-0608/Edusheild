"use client";

import { motion } from "framer-motion";
import { Settings, Wrench } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h2>
        <p className="text-slate-500 mt-1">Configure global application settings and compliance rules.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
          <Wrench className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Settings Module Under Construction</h3>
        <p className="text-slate-600 max-w-sm mx-auto">
          The global configuration panel is currently being built. Check back soon for API key management and global compliance thresholds.
        </p>
      </motion.div>
    </div>
  );
}
