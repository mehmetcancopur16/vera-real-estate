"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  ChevronRight,
  Home,
  LayoutDashboard,
  List,
  Loader2,
  LogOut,
  Menu,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ADMIN_NAV = [
  {
    href: "/admin",
    label: "Genel Bakış",
    icon: LayoutDashboard,
    desc: "İstatistikler ve özet",
    iconColor: "from-violet-500 to-purple-600",
    exact: true,
  },
  {
    href: "/admin/users",
    label: "Kullanıcılar",
    icon: Users,
    desc: "Tüm kullanıcıları yönet",
    iconColor: "from-blue-500 to-indigo-600",
  },
  {
    href: "/admin/listings",
    label: "İlanlar",
    icon: List,
    desc: "Tüm ilanları yönet",
    iconColor: "from-emerald-500 to-teal-600",
  },
];

function initialsFromName(name) {
  if (!name) return "AD";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, logout, user } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setAuthChecked(true));
  }, [checkAuth]);

  useEffect(() => {
    if (authChecked && !isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user && user.role !== "admin") {
        router.replace("/my-listings");
      }
    }
  }, [authChecked, isAuthenticated, isLoading, user, router]);

  if (!authChecked || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-xl">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
          Admin yetkisi kontrol ediliyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") return null;

  const initials = initialsFromName(user?.name);

  const SidebarContent = (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg transition group-hover:scale-105">
            <Shield className="h-4 w-4 text-white" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-none tracking-tight text-white">
              Admin Panel
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Vera Yönetimi
            </p>
          </div>
        </Link>
      </div>

      {/* Nav label */}
      <div className="mt-5 px-5 pb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
          Yönetim Menüsü
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200",
                active
                  ? "bg-slate-800 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
              ].join(" ")}
            >
              {active && (
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 to-transparent" />
              )}
              <span
                className={[
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                  active
                    ? `bg-gradient-to-br ${item.iconColor} shadow-md`
                    : "bg-slate-800 group-hover:bg-slate-700",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 text-white" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-bold leading-tight">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-none text-slate-500">
                  {item.desc}
                </span>
              </span>
              {active && (
                <span className="absolute right-2.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider + site links */}
      <div className="px-3 pb-2">
        <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
          Site
        </p>
        <Link
          href="/my-listings"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Home className="h-4 w-4" />
          Kullanıcı Paneli
        </Link>
      </div>

      {/* Bottom: user + logout */}
      <div className="shrink-0 border-t border-slate-800 p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-800/50 px-3 py-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
            <AvatarFallback className="bg-violet-700 text-xs font-black text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white leading-tight">{user?.name}</p>
            <p className="truncate text-[10px] text-slate-400">{user?.email}</p>
          </div>
          <span className="rounded-full bg-violet-700 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
            Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => { logout(); router.push("/login"); }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-transparent px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-red-700 hover:bg-red-900/20 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  const pageTitles = {
    "/admin": "Genel Bakış",
    "/admin/users": "Kullanıcı Yönetimi",
    "/admin/listings": "İlan Yönetimi",
  };
  const pageTitle = pageTitles[pathname] || "Admin Panel";

  return (
    <div className="min-h-screen bg-slate-100 text-foreground">
      {/* Fixed top header */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-xl">
        <div className="flex h-full items-center gap-3 px-4 md:px-6">
          {/* Mobile: hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                aria-label="Menü"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 shadow-sm transition hover:bg-slate-800 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[272px] p-0 overflow-hidden border-slate-800">
                <SheetHeader className="sr-only">
                  <SheetTitle>Admin Menü</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto">{SidebarContent}</div>
              </SheetContent>
            </Sheet>
            <Link href="/admin" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-700 shadow">
                <Shield className="h-4 w-4 text-white" />
              </span>
              <span className="text-sm font-extrabold text-white">Admin</span>
            </Link>
          </div>

          {/* Desktop breadcrumb */}
          <div
            className="hidden flex-1 items-center gap-2 text-sm md:flex"
            style={{ paddingLeft: 272 }}
          >
            <span className="font-medium text-slate-500">Admin</span>
            <ChevronRight className="h-4 w-4 text-slate-600" />
            <span className="font-bold text-white">{pageTitle}</span>
          </div>

          {/* Mobile title */}
          <div className="flex-1 md:hidden">
            <span className="text-sm font-bold text-white">{pageTitle}</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-700 bg-violet-900/40 px-2.5 py-1 text-[11px] font-semibold text-violet-300">
              <Shield className="h-3 w-3" />
              Admin
            </div>
          </div>
        </div>
      </header>

      {/* Fixed sidebar */}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[272px] overflow-hidden border-r border-slate-800 md:flex md:flex-col">
        {SidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-col pt-16 md:pl-[272px]">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
