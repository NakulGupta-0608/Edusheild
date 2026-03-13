"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  ShieldAlert,
  ArrowUpRight,
  ShieldCheck,
  Search
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  
  // Placeholder mock data until we hook up the database APIs
  const stats = [
    { name: "Total Institutes", value: "1,240", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Students Capacity", value: "348,000", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Active Complaints", value: "12", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "High Risk Institutes", value: "3", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
  ];

  const recentRegistrations = [
    { id: "INS-1049", name: "Apex Coaching Center", location: "Delhi", status: "Pending Verification", date: "Today" },
    { id: "INS-1048", name: "Bright Minds Academy", location: "Mumbai", status: "Verified", date: "Yesterday" },
    { id: "INS-1047", name: "Pioneer Classes", location: "Kota", status: "Verified", date: "Yesterday" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header section with search */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Platform Overview</h2>
          <p className="text-neutral-500 mt-1">Monitor compliance across all registered coaching centers.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by Institute ID..." 
              className="pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <Link 
            href="/admin/register-institute"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            New Registration
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name}
            className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-neutral-500">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">12%</span>
              <span className="ml-2">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-6 py-5 flex justify-between items-center">
            <h3 className="text-lg font-medium text-neutral-900">Recent Registrations</h3>
            <Link href="/admin/institutes" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-500">
              <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-700">
                <tr>
                  <th scope="col" className="px-6 py-4">Institute ID</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Location</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {recentRegistrations.map((inst) => (
                  <tr key={inst.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-900">{inst.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{inst.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{inst.location}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        inst.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link href={`/admin/institutes/${inst.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Flag / High Risk Panel */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-red-200 px-6 py-5 bg-white">
            <h3 className="text-lg font-medium text-red-700 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              AI Risk Alerts
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-sm text-neutral-600 mb-6 font-medium">
              These institutes have been flagged by the automated capacity monitor or image verification AI.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-red-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-neutral-900 text-sm">INS-0842</span>
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded">Overcapacity</span>
                </div>
                <p className="text-xs text-neutral-500">Exceeded max capacity by 45 students based on sq footage rules.</p>
                <div className="mt-3 flex justify-end">
                  <button className="text-xs font-semibold text-red-600 hover:text-red-700">Issue Warning</button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-amber-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-neutral-900 text-sm">INS-0991</span>
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded">Fire Safety Failed</span>
                </div>
                <p className="text-xs text-neutral-500">AI verification could not detect standard fire safety exits in uploaded images.</p>
                <div className="mt-3 flex justify-end">
                  <button className="text-xs font-semibold text-amber-600 hover:text-amber-700">Request Inspection</button>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6 text-center">
              <Link href="/admin/alerts" className="text-sm font-medium text-red-600 hover:text-red-500">
                View all security alerts <ArrowUpRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
