"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  UploadCloud,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  Building2
} from "lucide-react";
import Link from "next/link";

export default function InstituteDashboard() {

  const [profile, setProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/institutes/me').then(res => res.json()),
      fetch('/api/students/list').then(res => res.json())
    ])
    .then(([profileData, studentsData]) => {
      if (profileData.success) {
        setProfile(profileData.data);
      }
      if (studentsData.success) {
        setStudents(studentsData.data);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-red-500">Failed to load profile.</div>;
  }

  // Live data representing the institute's current capacity and compliance status
  const maxCapacity = profile.capacity?.maxAllowed || 0;
  const currentStudents = profile.capacity?.currentlyEnrolled || 0;
  const capacityPercentage = maxCapacity > 0 ? Math.round((currentStudents / maxCapacity) * 100) : 0;
  
  // Status logic based on guidelines
  const isNearCapacity = capacityPercentage >= 90;
  const isOverCapacity = currentStudents > maxCapacity;
  
  let capacityColor = "bg-emerald-500";
  let capacityBarColor = "bg-emerald-100";
  let capacityTextColor = "text-emerald-700";

  if (isOverCapacity) {
    capacityColor = "bg-red-500";
    capacityBarColor = "bg-red-100";
    capacityTextColor = "text-red-700";
  } else if (isNearCapacity) {
    capacityColor = "bg-amber-500";
    capacityBarColor = "bg-amber-100";
    capacityTextColor = "text-amber-700";
  }

  const complianceDocs = [
    { name: "Fire Safety Certificate", status: "Verified", date: "Jan 12, 2026", type: "Document" },
    { name: "Classroom Dimension Photos", status: "AI Verified", date: "Feb 05, 2026", type: "Image check" },
    { name: "CCTV/Security Audit", status: "Pending", date: "-", type: "Inspection" },
  ];



  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Institute Overview</h2>
          <p className="text-slate-500 mt-1">Manage your capacity, students, and regulatory compliance.</p>
        </div>
        
        <Link 
          href="/institute/students/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Users className="h-4 w-4" />
          Enroll Student
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Capacity Monitor (Most Important Guideline Feature) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Live Capacity Monitor
                </h3>
                <p className="text-sm text-slate-500 mt-1">Based on verified per-student sq. footage guidelines.</p>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${isOverCapacity ? 'bg-red-100 text-red-700' : isNearCapacity ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isOverCapacity ? 'Over Limit!' : isNearCapacity ? 'Near Capacity' : 'Compliant'}
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-extrabold tracking-tight ${capacityTextColor}`}>
                  {currentStudents}
                </span>
                <span className="text-slate-500 font-medium">/ {maxCapacity} students</span>
              </div>
              <span className="text-slate-500 font-medium">{capacityPercentage}% filled</span>
            </div>

            {/* Progress Bar Component */}
            <div className={`h-4 w-full rounded-full overflow-hidden ${capacityBarColor}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${capacityColor}`}
              />
            </div>
            
            {/* Warning Message */}
            <div className={`mt-4 flex items-start gap-3 p-3 rounded-lg ${isOverCapacity ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold block mb-0.5">{isOverCapacity ? 'DANGER: Exceeds Approved Capacity! Violation Risk' : 'Safe: Within Approved Limit'}</span>
                {isOverCapacity 
                  ? "You have exceeded your maximum allowed students based on your infrastructure size. Please halt admissions immediately to avoid penalization."
                  : "Your institute's active enrollments are compliant with the 1 sq.m per student rule."}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{profile.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {profile.instituteId}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <span className="text-slate-600">
                {profile.address?.street}, {profile.address?.city}, {profile.address?.state} {profile.address?.pincode}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {profile.riskStatus === 'SAFE' && <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />}
              {profile.riskStatus === 'PENDING_REGISTRATION' && <CheckCircle2 className="h-4 w-4 text-slate-500 shrink-0" />}
              {(profile.riskStatus === 'WARNING' || profile.riskStatus === 'UNSAFE') && <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />}
              <span className="text-slate-600 font-medium">Verification Status: 
                <span className={`font-bold ml-1 ${profile.riskStatus === 'SAFE' ? 'text-emerald-600' : profile.riskStatus === 'PENDING_REGISTRATION' ? 'text-slate-600' : 'text-red-600'}`}>
                  {profile.riskStatus.replace('_', ' ')}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Compliance Checklist */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-indigo-500" />
              Compliance Tasks
            </h3>
            <Link href="/institute/compliance" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Manage</Link>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {complianceDocs.map((doc, idx) => (
                <li key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {doc.status.includes('Verified') 
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> 
                      : <div className="h-5 w-5 rounded-full border-2 border-amber-400 flex items-center justify-center"><div className="h-2 w-2 bg-amber-400 rounded-full"></div></div>
                    }
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                  {doc.status === 'Pending' ? (
                    <button className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-50">Upload</button>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{doc.status}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Recent Enrollments
            </h3>
            <Link href="/institute/students" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="space-y-4 flex-1">
              {students.slice(0, 3).map((student) => (
                <div key={student._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm uppercase">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.courseEnrolled} • {student.age} yrs old</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {students.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No students enrolled yet.</p>
              )}
            </div>
            <Link 
              href="/institute/students/new"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              Register New Student <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
