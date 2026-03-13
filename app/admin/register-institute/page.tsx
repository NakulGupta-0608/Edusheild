"use client";

import { useState } from "react";
import { Copy, Building2, User, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterInstituteForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [generatedPass, setGeneratedPass] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    contact: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API Call for Prototype
    setTimeout(() => {
      // Logic to happen when connecting to Mongoose:
      // 1. Generate random secure ID and Password
      // 2. Hash Password
      // 3. Save Institute record as 'PENDING_REGISTRATION' status
      // 4. Return plain credentials to admin
      
      const newId = `INS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newPass = Math.random().toString(36).slice(-8);
      
      setGeneratedId(newId);
      setGeneratedPass(newPass);
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText(`Institute ID: ${generatedId}\nPassword: ${generatedPass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Register New Coaching Center</h2>
        <p className="text-neutral-500 mt-1 max-w-2xl">
          As per the Ministry guidelines, you must create an initial record for the institute. They will use the generated credentials to log in and upload their required compliance details.
        </p>
      </div>

      {!success ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm"
        >
          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-neutral-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-neutral-400" />
                  Institute Legal Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Pinnacle Classes"
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <hr className="border-neutral-100 my-2" />
                <h3 className="text-sm font-semibold text-neutral-900 mt-4 mb-2">Owner / Point of Contact Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Official Email Address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-end gap-x-4">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-neutral-900 px-4 py-2 hover:bg-neutral-50 rounded-md transition-colors"
                onClick={() => setFormData({ name: "", ownerName: "", email: "", contact: "" })}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Generate Institute Identity
                  </>
                )}
              </button>
            </div>
            
          </form>
        </motion.div>

      ) : (

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-200 bg-white p-8 shadow-sm text-center max-w-2xl mx-auto mt-12"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Registration Initialized</h3>
          <p className="text-neutral-600 mb-8 px-4">
            A temporary ID and password have been generated for <strong className="text-neutral-900">{formData.name}</strong>. Share these credentials securely with the absolute owner.
          </p>

          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 mb-8 text-left relative overflow-hidden group">
            {/* Copy Button */}
            <button 
              onClick={copyCredentials}
              className="absolute top-4 right-4 p-2 bg-white border border-neutral-200 rounded text-neutral-500 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm flex items-center gap-2 text-xs font-semibold z-10"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500"/> : <Copy className="h-4 w-4"/>}
              {copied ? "Copied" : "Copy"}
            </button>
            
            <div className="space-y-4 relative z-0">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-1">Institute ID</p>
                <p className="text-2xl font-mono font-bold text-neutral-900 bg-white inline-block px-3 py-1 rounded border border-neutral-200 select-all">{generatedId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-1">Temporary Password</p>
                <p className="text-lg font-mono font-medium text-neutral-900 bg-white inline-block px-3 py-1 rounded border border-neutral-200 select-all">{generatedPass}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => {
                setSuccess(false);
                setFormData({ name: "", ownerName: "", email: "", contact: "" });
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-lg transition-colors"
            >
              Register Another
            </button>
            <Link 
              href="/admin/dashboard"
              className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}

    </div>
  );
}
