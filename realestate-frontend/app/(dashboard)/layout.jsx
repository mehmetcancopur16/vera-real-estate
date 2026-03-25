"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  PlusSquare,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [
  { href: "/my-listings", label: "İlanlarım", icon: LayoutDashboard, desc: "İlanlarını yönet & analiz et" },
  { href: "/add-listing", label: "Yeni İlan", icon: PlusSquare, desc: "Yeni portföy ekle" },
  { href: "/profile", label: "Profil", icon: UserCircle2, desc: "Hesap ayarları" },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, logout, user } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  const pageTitleMap = {
    "/my-listings": "İlanlarım",
    "/add-listing": "Yeni İlan Ekle",
    "/profile": "Profil",
  };
  const pageTitle = pageTitleMap[pathname] || "Dashboard";

  useEffect(() => {
    checkAuth().finally(() => setAuthChecked(true));
  }, [checkAuth]);

  useEffect(() => {
    if (authChecked && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecked, isAuthenticated, isLoading, router]);

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Yetki kontrol ediliyor...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-4 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 -bottom-28 size-72 rounded-full bg-white/10 blur-3xl" />

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <Building2 className="h-5 w-5 text-accent" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/60">Vera Panel</p>
              <p className="mt-0.5 text-sm font-semibold tracking-tight">Dashboard</p>
            </div>
          </div>
          <Sparkles className="h-5 w-5 text-accent/90" />
        </div>

        <div className="mt-4 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur">
          <p className="text-xs text-white/60">Hoş geldin</p>
          <p className="mt-1 truncate text-sm font-semibold">{user?.name || "Kullanıcı"}</p>
          <p className="mt-1 truncate text-xs text-white/60">{user?.email || "Hesap"}</p>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">Menü</p>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Aktif
        </span>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                "hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm",
                active
                  ? "bg-slate-950 text-white shadow-sm ring-1 ring-slate-950"
                  : "text-slate-800 ring-1 ring-transparent hover:ring-slate-200",
              ].join(" ")}
            >
              {active ? (
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 to-transparent" />
              ) : null}

              <span
                className={[
                  "relative inline-flex size-10 items-center justify-center rounded-xl ring-1 transition",
                  active
                    ? "bg-white/10 text-accent ring-white/10"
                    : "bg-white text-slate-700 ring-slate-200 group-hover:ring-slate-300",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-tight">{item.label}</span>
                <span className={["block truncate text-xs", active ? "text-white/70" : "text-slate-500"].join(" ")}>
                  {item.desc}
                </span>
              </span>

              {active ? (
                <span className="absolute right-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(0,0,0,0.12)]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-700 hover:shadow-md"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-foreground">
      <div className="border-b border-slate-200/70 bg-white/70 backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Building2 className="h-4 w-4 text-accent" />
            </span>
            {pageTitle}
          </div>
          <Sheet>
            <SheetTrigger
              aria-label="menu"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[290px]">
              <SheetHeader>
                <SheetTitle>Kullanıcı Paneli</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{SidebarContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-61px)] w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:min-h-screen md:grid-cols-[280px_1fr]">
        <aside className="sticky top-6 hidden h-[calc(100vh-48px)] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:block">
          {SidebarContent}
        </aside>

        <main className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden items-center justify-between gap-3 border-b border-slate-200/70 px-6 py-5 md:flex">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Dashboard</span>
              <ChevronRight className="h-4 w-4" />
              <span className="font-semibold text-slate-900">{pageTitle}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Oturum aktif
            </div>
          </div>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
