import { Outlet, Link, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Briefcase, LayoutDashboard, User, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RootLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Jobs", href: "/jobs" },
    { name: "Applications", href: "/applications" },
    { name: "Profile", href: "/profile" },
  ];

  // Hide nav on landing page
  if (location.pathname === "/") {
    return (
      <div className="min-h-screen bg-background font-sans antialiased text-foreground dark overflow-hidden relative">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="relative z-10">
          <Outlet />
        </div>
        <Toaster richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden dark">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-border/50 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">A</div>
            <span className="font-semibold tracking-tight text-lg text-white">AutoApply.ai</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "hover:text-blue-400 transition-colors pb-5 pt-5",
                    isActive
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-white/60"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-white">Demo User</span>
            <span className="text-[10px] text-white/40">Premium Plan</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 bg-gradient-to-tr from-blue-500 to-purple-500"></div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Atmospheric Background Glows */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="flex-1 overflow-auto bg-transparent z-10 relative">
          <Outlet />
        </div>
      </main>
      
      <Toaster richColors />
    </div>
  );
}
