"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Users, 
  UploadCloud, 
  Settings, 
  LogOut,
  GraduationCap
} from "lucide-react";

export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/institute/dashboard", icon: Building2 },
    { name: "Students", href: "/institute/students", icon: Users },
    { name: "Compliance & Docs", href: "/institute/compliance", icon: UploadCloud },
    { name: "Settings", href: "/institute/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 selection:bg-blue-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-200 bg-white shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Institute Portal</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {session?.user?.name ? session.user.name.charAt(0) : "I"}
            </div>
            <div className="flex flex-col max-w-[140px]">
              <span className="text-sm font-semibold truncate">{session?.user?.name || "Institute"}</span>
              <span className="text-xs text-slate-500 font-medium">ID: {(session?.user as any)?.instituteId || "INS-XXXX"}</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white">
          <h1 className="text-xl font-semibold capitalize">
            {pathname.split("/").pop()?.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Verified
            </span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 border-l border-white">
          {children}
        </div>
      </main>
    </div>
  );
}
