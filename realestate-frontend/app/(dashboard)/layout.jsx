"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Building2,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Crown,
  Eye,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Plus,
  PlusSquare,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  UserCircle2,
  X,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyProperties } from "@/services/property.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  DropdownMenuGroup,
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
  {
    href: "/upgrade",
    label: "Planı Yükselt",
    icon: Crown,
    desc: "Abonelik yönetimi",
    iconColor: "from-amber-500 to-orange-500",
  },
];

/* ── helpers ── */
function initialsFromName(name) {
  if (!name) return "VR";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatRelative(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "Az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat önce`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day} gün önce`;
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
}

/* ── notification helpers ── */
const NOTIF_READ_KEY = "vera_notifs_read";

function loadReadIds() {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIF_READ_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveReadIds(ids) {
  localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...ids]));
}

function buildNotifications(items) {
  const notifs = [];
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  /* Welcome — always present */
  notifs.push({
    id: "welcome",
    icon: Sparkles,
    iconClass: "text-accent bg-amber-50",
    title: "Vera Premium'a Hoş Geldiniz",
    body: "Paneliniz hazır. İlanlarınızı yönetebilir, analiz edebilirsiniz.",
    date: null,
    href: "/my-listings",
  });

  /* Recently added listings */
  const recent = items
    .filter((p) => p.createdAt && now - new Date(p.createdAt).getTime() < sevenDays)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  for (const p of recent) {
    notifs.push({
      id: `new-${p._id}`,
      icon: Check,
      iconClass: "text-green-600 bg-green-50",
      title: "İlan Yayınlandı",
      body: p.title,
      date: p.createdAt,
      href: `/properties/${p._id}`,
    });
  }

  /* Top viewed */
  const top = [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0];
  if (top && (top.viewCount || 0) > 0) {
    notifs.push({
      id: `top-${top._id}`,
      icon: TrendingUp,
      iconClass: "text-blue-600 bg-blue-50",
      title: "En Çok Görüntülenen",
      body: `"${top.title}" — ${(top.viewCount || 0).toLocaleString("tr-TR")} görüntülenme`,
      date: null,
      href: `/properties/${top._id}`,
    });
  }

  /* Passive listings warning */
  const passiveCount = items.filter((p) => !p.isActive).length;
  if (passiveCount > 0) {
    notifs.push({
      id: "passive-warning",
      icon: Eye,
      iconClass: "text-orange-600 bg-orange-50",
      title: "Pasif İlanlarınız Var",
      body: `${passiveCount} ilanınız pasif durumda. Kontrol etmek ister misiniz?`,
      date: null,
      href: "/my-listings",
    });
  }

  /* Featured listing nudge if nothing featured */
  const featuredCount = items.filter((p) => p.isFeatured).length;
  if (items.length > 0 && featuredCount === 0) {
    notifs.push({
      id: "no-featured",
      icon: Star,
      iconClass: "text-amber-600 bg-amber-50",
      title: "İlan Öne Çıkarın",
      body: "Öne çıkan ilanlarınız daha fazla ilgi alır.",
      date: null,
      href: "/my-listings",
    });
  }

  return notifs;
}

/* ══════════════════════════════════════════════
   NotificationDropdown component
══════════════════════════════════════════════ */
function NotificationDropdown() {
  const [readIds, setReadIds] = useState(() => loadReadIds());
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["my-properties", { includeInactive: 1 }],
    queryFn: () => getMyProperties({ page: 1, limit: 20, includeInactive: 1 }),
    staleTime: 60_000,
  });

  const items = useMemo(() => data?.data || [], [data]);
  const notifications = useMemo(() => buildNotifications(items), [items]);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds]
  );

  const markAllRead = () => {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const markRead = (id) => {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    saveReadIds(next);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label="Bildirimler"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-slate-900 ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 p-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-slate-900">Bildirimler</p>
            {unreadCount > 0 && (
              <p className="text-xs text-slate-500">{unreadCount} okunmamış</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); markAllRead(); }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tümünü okundu işaretle
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Bell className="h-8 w-8 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">Bildirim yok</p>
            </div>
          )}
          {notifications.map((notif) => {
            const Icon = notif.icon;
            const isRead = readIds.has(notif.id);
            return (
              <Link
                key={notif.id}
                href={notif.href}
                onClick={() => { markRead(notif.id); setOpen(false); }}
                className={[
                  "flex items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50",
                  !isRead ? "bg-amber-50/40" : "",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    notif.iconClass,
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      {notif.title}
                    </p>
                    {!isRead && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                    {notif.body}
                  </p>
                  {notif.date && (
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      {formatRelative(notif.date)}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-2">
          <Link
            href="/my-listings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            İlanlarıma Git
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ══════════════════════════════════════════════
   DashboardLayout
══════════════════════════════════════════════ */
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, logout, user } =
    useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isEditListing = pathname?.startsWith("/edit-listing/");

  const pageTitleMap = {
    "/my-listings": "İlanlarım",
    "/add-listing": "Yeni İlan Ekle",
    "/profile": "Profil",
    "/upgrade": "Plan Yükselt",
    "/upgrade/checkout": "Ödeme",
    "/upgrade/success": "Başarılı",
  };
  const pageTitle = isEditListing
    ? "İlan Düzenle"
    : pageTitleMap[pathname] || "Dashboard";

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

  /* ─── Sidebar content ─── */
  const SidebarContent = (
    <div className="flex h-full flex-col">

      {/* Brand header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <Link href="/my-listings" className="flex items-center gap-3 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-md transition group-hover:scale-105">
            <Building2 className="h-4 w-4 text-accent" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-none tracking-tight text-slate-900">
              Vera
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Premium Panel
            </p>
          </div>
        </Link>
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
              {active && (
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 to-transparent" />
              )}

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
                    active
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-700",
                  ].join(" ")}
                />
              </span>

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

              {active && (
                <span className="absolute right-2.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Subscription badge */}
      {user && (
        <div className="px-3 pb-2">
          {(() => {
            const plan = user?.subscription?.plan || "free";
            const planStyles = {
              free: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Zap, label: "Free Plan", hint: "3 ilan limiti" },
              professional: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Star, label: "Pro Plan", hint: "7 ilan limiti" },
              corporate: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Crown, label: "Corporate", hint: "Sınırsız ilan" },
            };
            const ps = planStyles[plan] || planStyles.free;
            const PlanIcon = ps.icon;
            return (
              <Link
                href="/upgrade"
                className={`flex items-center gap-2.5 rounded-2xl border ${ps.border} ${ps.bg} px-3 py-2.5 transition hover:brightness-95`}
              >
                <PlanIcon className={`h-4 w-4 ${ps.text}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-extrabold ${ps.text}`}>{ps.label}</p>
                  <p className="text-[10px] text-slate-400">{ps.hint}</p>
                </div>
                {plan === "free" && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                    Yükselt
                  </span>
                )}
              </Link>
            );
          })()}
        </div>
      )}

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
          onClick={() => {
            logout();
            router.push("/login");
          }}
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

      {/* ════════════════════════════════════
          FIXED TOP HEADER
      ════════════════════════════════════ */}
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

          {/* Desktop: breadcrumb offset past sidebar */}
          <div
            className="hidden flex-1 items-center gap-2 text-sm md:flex"
            style={{ paddingLeft: 272 }}
          >
            <span className="font-medium text-slate-400">Dashboard</span>
            <ChevronRight className="h-4 w-4 text-slate-300" />
            {isEditListing ? (
              <>
                <Link
                  href="/my-listings"
                  className="font-medium text-slate-500 transition hover:text-slate-900"
                >
                  İlanlarım
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-300" />
                <span className="font-bold text-slate-900">İlan Düzenle</span>
              </>
            ) : (
              <span className="font-bold text-slate-900">{pageTitle}</span>
            )}
          </div>

          {/* Mobile: page title */}
          <div className="flex-1 md:hidden">
            <span className="text-sm font-bold text-slate-900">{pageTitle}</span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Quick add */}
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

            {/* Notification dropdown */}
            <NotificationDropdown />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-2.5 shadow-sm transition hover:bg-slate-50 focus:outline-none">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
                  <AvatarFallback className="bg-slate-900 text-[10px] font-black text-accent">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-700 md:block">
                  {user?.name || "Kullanıcı"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-2.5 py-0.5">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
                        <AvatarFallback className="bg-slate-900 text-[10px] font-black text-accent">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {user?.name || "Kullanıcı"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserCircle2 className="mr-2 h-4 w-4 text-violet-500" />
                  Profil Ayarları
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-listings")}>
                  <LayoutDashboard className="mr-2 h-4 w-4 text-blue-500" />
                  İlanlarım
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/add-listing")}>
                  <Plus className="mr-2 h-4 w-4 text-emerald-500" />
                  Yeni İlan Ekle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════
          FIXED LEFT SIDEBAR (desktop only)
      ════════════════════════════════════ */}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[272px] overflow-hidden border-r border-slate-200/80 bg-white shadow-sm md:flex md:flex-col">
        {SidebarContent}
      </aside>

      {/* ════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════ */}
      <div className="flex min-h-screen flex-col pt-16 md:pl-[272px]">

        {/* Sticky page sub-header */}
        <div className="sticky top-16 z-30 border-b border-slate-200/70 bg-white/90 px-5 py-3.5 shadow-sm backdrop-blur-md md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-slate-900">
                {pageTitle}
              </h1>
              <p className="mt-0.5 truncate text-xs text-slate-400">{pageDesc}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 md:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Oturum Aktif
              </div>
              <div className="hidden items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 md:inline-flex">
                <Sparkles className="h-2.5 w-2.5 text-accent" />
                Premium
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
