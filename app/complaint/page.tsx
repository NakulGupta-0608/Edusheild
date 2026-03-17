"use client";

import { useState } from "react";
import { AlertTriangle, Send, Shield, CheckCircle2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ComplaintPortal() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "COMPLAINT",
    instituteNameText: "",
    category: "",
    description: "",
    complainantType: "STUDENT",
    isAnonymous: false,
    name: "",
    contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          complainantType: formData.complainantType,
          complainantName: formData.isAnonymous ? 'Anonymous' : formData.name,
          complainantContact: formData.isAnonymous ? '' : formData.contact,
          instituteNameText: formData.instituteNameText,
          category: formData.category,
          description: formData.description
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-amber-200">
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mr-8">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">EduSheild</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:max-w-3xl">
        
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-200 bg-white p-12 shadow-sm text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {formData.type === 'SUGGESTION' ? 'Suggestion' : 'Complaint'} Submitted Securely
            </h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Your {formData.type === 'SUGGESTION' ? 'suggestion' : 'grievance'} has been securely logged and forwarded to the Ministry compliance authorities for immediate review. 
              {formData.isAnonymous && " Your identity has been completely obfuscated."}
            </p>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-w-xs mx-auto mb-8">
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-1">Tracking ID</p>
              <p className="text-xl font-mono font-bold text-slate-900 tracking-widest">
                CP-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </p>
            </div>

            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 text-center sm:text-left">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4 sm:hidden">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl flex items-center gap-3 justify-center sm:justify-start">
                <AlertTriangle className="h-8 w-8 text-amber-500 hidden sm:block" />
                Report a Violation
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                Help maintain student safety. Report coaching centers that violate <a href="#" className="text-blue-600 hover:underline">Ministry of Education</a> guidelines (overcrowding, unsafe facilities, unauthorized fees).
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                
                {/* Type Selection */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'COMPLAINT'})}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.type === 'COMPLAINT' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Submit a Complaint
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'SUGGESTION'})}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.type === 'SUGGESTION' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Make a Suggestion
                  </button>
                </div>
                
                {/* Institute Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">1. Incident Context</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Institute Name & Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.instituteNameText}
                      onChange={(e) => setFormData({...formData, instituteNameText: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                      placeholder="e.g. Apex Classes, Sector 14, Gurugram"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Primary Guideline Violated *</label>
                    <div className="relative">
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full appearance-none rounded-lg border border-slate-300 py-3 pl-4 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                      >
                        <option value="" disabled>Select the violation category...</option>
                        <option value="OVERCROWDING">Severe Overcrowding in Classroom</option>
                        <option value="FIRE">Lack of Fire Exits / Safety</option>
                        <option value="WATER">Poor Water Supply Facility</option>
                        <option value="FACILITIES">Poor General Facilities</option>
                        <option value="SAFETY">Other Safety Concerns</option>
                        <option value="OTHER">Other Guideline Breach</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Detailed Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors resize-none"
                      placeholder="Please explicitly describe the situation, dates, and what you observed..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Evidence Upload (Optional)</label>
                    <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-8 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-slate-300 group-hover:text-blue-500 transition-colors" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                          <span className="relative cursor-pointer rounded-md bg-transparent font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                            Upload photos or audio
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-slate-500 mt-1">PNG, JPG, MP4 up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complainant Info */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 flex justify-between items-center">
                    2. Your Details
                    <div className="flex items-center gap-2">
                      <input
                        id="anonymous"
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <label htmlFor="anonymous" className="text-sm font-medium text-slate-700 cursor-pointer">Submit Anonymously</label>
                    </div>
                  </h3>

                  <div className={`space-y-6 transition-all duration-300 ${formData.isAnonymous ? 'opacity-40 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
                    <div className="flex gap-4">
                      {['STUDENT', 'PARENT', 'PUBLIC'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, complainantType: type})}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            formData.complainantType === type 
                              ? 'bg-blue-50 border-blue-200 text-blue-700' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Full Name</label>
                        <input
                          type="text"
                          required={!formData.isAnonymous}
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Contact Value (Email/Phone)</label>
                        <input
                          type="text"
                          required={!formData.isAnonymous}
                          value={formData.contact}
                          onChange={(e) => setFormData({...formData, contact: e.target.value})}
                          className="w-full rounded-lg border border-slate-300 py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 flex gap-3 text-blue-800 text-sm">
                    <Shield className="h-5 w-5 shrink-0" />
                    <p>All complaints are treated with strict confidentiality. Retaliation by coaching institutes against complainants is a severe violation of the 2024 regulations.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-xl bg-slate-900 px-4 py-3.5 text-base font-semibold text-white shadow-md hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full border-2 border-slate-500 border-t-white animate-spin"></div>
                        Processing securely...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Submit Official Complaint
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
