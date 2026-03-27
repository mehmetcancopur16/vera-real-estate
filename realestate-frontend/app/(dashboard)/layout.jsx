"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Plus,
  PlusSquare,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── nav items ── */
const NAV_ITEMS = [
  {
    href: "/my-listings",
    label: "İlanlarım",
    icon: LayoutDashboard,
    desc: "Portföyünü yönet",
    iconColor: "from-blue-500 to-indigo-600",
  },
  {
    href: "/add-listing",
    label: "Yeni İlan",
    icon: PlusSquare,
    desc: "Portföy ekle",
    iconColor: "from-emerald-500 to-teal-600",
    badge: "Yeni",
  },
  {
    href: "/profile",
    label: "Profil",
    icon: UserCircle2,
    desc: "Hesap ayarları",
    iconColor: "from-violet-500 to-purple-600",
  },
];

function initialsFromName(name) {
  if (!name) return "VR";
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, logout, user } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isEditListing = pathname?.startsWith("/edit-listing/");

  const pageTitleMap = {
    "/my-listings": "İlanlarım",
    "/add-listing": "Yeni İlan Ekle",
    "/profile": "Profil",
  };
  const pageTitle = isEditListing ? "İlan Düzenle" : pageTitleMap[pathname] || "Dashboard";

  const pageDesc = {
    "İlanlarım": "İlanlarınızı yönetin, düzenleyin ve analiz edin",
    "Yeni İlan Ekle": "4 adımlı sihirbaz ile profesyonel ilan oluşturun",
    "Profil": "Hesap bilgilerinizi ve güvenliğinizi yönetin",
    "İlan Düzenle": "Mevcut ilanınızın bilgilerini güncelleyin",
  }[pageTitle] || "";

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
          <Building2 className="h-7 w-7 text-accent" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Yetki kontrol ediliyor...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const initials = initialsFromName(user?.name);

  /* ─── Sidebar inner ─── */
  const SidebarContent = (
    <div className="flex h-full flex-col">

      {/* Brand header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-md">
          <Building2 className="h-4.5 w-4.5 text-accent" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold leading-none tracking-tight text-slate-900">Vera</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
            Premium Panel
          </p>
        </div>
      </div>

      {/* User card */}
      <div className="mx-3 mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3.5 shadow-lg">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/25 blur-2xl" />
          <div className="pointer-events-none absolute -left-4 -bottom-4 h-14 w-14 rounded-full bg-blue-500/15 blur-xl" />
          <div className="relative flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 ring-2 ring-accent/60">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
                <AvatarFallback className="bg-slate-700 text-xs font-black text-accent">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-800" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white leading-none">
                {user?.name || "Kullanıcı"}
              </p>
              <p className="mt-1 truncate text-[11px] text-white/50 leading-none">
                {user?.email || ""}
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent/20 px-1.5 py-0.5">
                <Sparkles className="h-2.5 w-2.5 text-accent" />
                <span className="text-[9px] font-bold uppercase tracking-wide text-accent">
                  Premium
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div className="mt-5 px-5 pb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
          Menü
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href === "/my-listings" && isEditListing);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200",
                active
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              {/* Active glow overlay */}
              {active && (
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 to-transparent" />
              )}

              {/* Icon */}
              <span
                className={[
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                  active
                    ? `bg-gradient-to-br ${item.iconColor} shadow-md`
                    : "bg-slate-100 group-hover:bg-white group-hover:shadow-sm",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-4 w-4",
                    active ? "text-white" : "text-slate-500 group-hover:text-slate-700",
                  ].join(" ")}
                />
              </span>

              {/* Label */}
              <span className="min-w-0 flex-1">
                <span
                  className={[
                    "flex items-center gap-2 text-sm font-bold leading-tight",
                    active ? "text-white" : "",
                  ].join(" ")}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span
                  className={[
                    "mt-0.5 block text-[11px] leading-none",
                    active ? "text-white/55" : "text-slate-400",
                  ].join(" ")}
                >
                  {item.desc}
                </span>
              </span>

              {/* Active indicator */}
              {active && (
                <span className="absolute right-2.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 border-t border-slate-100 p-3 space-y-2">
        <Link
          href="/add-listing"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-gradient px-3 py-2.5 text-sm font-extrabold text-slate-900 shadow-md transition hover:brightness-105 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Yeni İlan Ekle
        </Link>
        <button
          type="button"
          onClick={() => { logout(); router.push("/login"); }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">

      {/* ══════════════════════════════════════════
          FIXED TOP HEADER
      ══════════════════════════════════════════ */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="flex h-full items-center gap-3 px-4 md:px-6">

          {/* Mobile: hamburger + brand */}
          <div className="flex items-center gap-3 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                aria-label="Menü"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[272px] p-0 overflow-hidden">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menü</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto">{SidebarContent}</div>
              </SheetContent>
            </Sheet>

            <Link href="/my-listings" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 shadow">
                <Building2 className="h-4 w-4 text-accent" />
              </span>
              <span className="text-sm font-extrabold text-slate-900">Vera</span>
            </Link>
          </div>

          {/* Desktop: breadcrumb (sidebar is fixed, header aligns with content) */}
          <div className="hidden flex-1 items-center gap-2 text-sm md:flex" style={{ paddingLeft: 272 }}>
            <span className="font-medium text-slate-400">Dashboard</span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            {isEditListing ? (
              <>
                <Link href="/my-listings" className="font-medium text-slate-500 hover:text-slate-900 transition">İlanlarım</Link>
                <ChevronRight className="h-4 w-4 text-slate-300" />
                <span className="font-bold text-slate-900">İlan Düzenle</span>
              </>
            ) : (
              <span className="font-bold text-slate-900">{pageTitle}</span>
            )}
          </div>

          {/* Mobile breadcrumb */}
          <div className="flex-1 md:hidden">
            <span className="text-sm font-bold text-slate-900">{pageTitle}</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden bg-gold-gradient text-primary hover:brightness-95 shadow-sm md:inline-flex"
            >
              <Link href="/add-listing">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Yeni İlan
              </Link>
            </Button>

            {/* Notification */}
            <button
              type="button"
              aria-label="Bildirimler"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-1 ring-white" />
            </button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-2.5 shadow-sm transition hover:bg-slate-50 focus:outline-none">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
                  <AvatarFallback className="bg-slate-900 text-[10px] font-black text-accent">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[90px] truncate text-sm font-semibold text-slate-700 md:block">
                  {user?.name?.split(" ")[0] || "Kullanıcı"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div>
                    <p className="font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCircle2 className="mr-2 h-4 w-4 text-violet-500" />
                    Profil Ayarları
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-listings">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-blue-500" />
                    İlanlarım
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => { logout(); router.push("/login"); }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          FIXED LEFT SIDEBAR (desktop only)
      ══════════════════════════════════════════ */}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[272px] overflow-hidden border-r border-slate-200/80 bg-white shadow-sm md:flex md:flex-col">
        {SidebarContent}
      </aside>

      {/* ══════════════════════════════════════════
          MAIN CONTENT (offset by header + sidebar)
      ══════════════════════════════════════════ */}
      <div className="flex min-h-screen flex-col pt-16 md:pl-[272px]">

        {/* Page sub-header */}
        <div className="sticky top-16 z-30 border-b border-slate-200/70 bg-white/90 px-5 py-3.5 shadow-sm backdrop-blur-md md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-slate-900">{pageTitle}</h1>
              <p className="mt-0.5 truncate text-xs text-slate-400">{pageDesc}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Oturum Aktif
              </div>
              <div className="hidden items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 md:inline-flex">
                <Sparkles className="h-2.5 w-2.5 text-accent" />
                Premium
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
