"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  AlertTriangle, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Institutes", href: "/admin/institutes", icon: Building2 },
    { name: "Register Institute", href: "/admin/register-institute", icon: ShieldCheck },
    { name: "Complaints", href: "/admin/complaints", icon: AlertTriangle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans text-neutral-900 selection:bg-indigo-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-neutral-200 bg-white">
        <div className="h-16 flex items-center px-6 border-b border-neutral-200">
          <ShieldCheck className="h-6 w-6 text-indigo-600 mr-2" />
          <span className="text-xl font-bold tracking-tight text-neutral-900">Admin Portal</span>
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
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-neutral-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{session?.user?.name || "Admin"}</span>
              <span className="text-xs text-neutral-500">Authority</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 opacity-70" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-neutral-200 bg-white/50 backdrop-blur-sm">
          <h1 className="text-xl font-semibold capitalize">
            {pathname.split("/").pop()?.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <AlertTriangle className="h-5 w-5 text-neutral-400 hover:text-neutral-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 border-l border-white shadow-[inset_1px_0_0_0_rgb(255_255_255/100%)]">
          {children}
        </div>
      </main>
    </div>
  );
}
