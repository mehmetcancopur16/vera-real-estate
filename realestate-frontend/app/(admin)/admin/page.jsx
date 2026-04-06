"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  Bell,
  Building2,
  CheckCircle2,
  Crown,
  Eye,
  Globe,
  LayoutDashboard,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { getAdminStats } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ── helpers ── */
function fmt(n) {
  return (n || 0).toLocaleString("tr-TR");
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTry(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

function initials(name) {
  return (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ── Animated counter ── */
function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const target = Number(value) || 0;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <>{display.toLocaleString("tr-TR")}</>;
}

/* ── Plan badges ── */
const PLAN_META = {
  free: { label: "Free", bg: "bg-slate-100", text: "text-slate-700", icon: Zap },
  professional: { label: "Pro", bg: "bg-blue-100", text: "text-blue-700", icon: Star },
  corporate: { label: "Corp", bg: "bg-amber-100", text: "text-amber-700", icon: Crown },
};

function PlanBadge({ plan }) {
  const m = PLAN_META[plan] || PLAN_META.free;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.bg} ${m.text}`}>
      <Icon className="h-2.5 w-2.5" />
      {m.label}
    </span>
  );
}

function RoleBadge({ role }) {
  if (role === "admin")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
        <Shield className="h-2.5 w-2.5" />
        Admin
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
      Üye
    </span>
  );
}

/* ── Metric card ── */
function MetricCard({ icon: Icon, iconGradient, label, value, sub, subClass, linkHref, stagger = 0 }) {
  return (
    <Link
      href={linkHref || "#"}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-entrance"
      style={{ animationDelay: `${stagger}ms` }}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 transition group-hover:opacity-20"
        style={{ backgroundImage: `linear-gradient(135deg, var(--accent), transparent)` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradient} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div className="mt-4">
        <p className="text-3xl font-extrabold tabular-nums text-foreground">
          <AnimatedNumber value={value} />
        </p>
        <p className="mt-0.5 text-sm font-medium text-slate-500">{label}</p>
        {sub && (
          <p className={`mt-1 text-xs font-semibold ${subClass || "text-slate-400"}`}>{sub}</p>
        )}
      </div>
    </Link>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    staleTime: 30_000,
  });

  const stats = data?.data;
  const pd = stats?.planDistribution || {};
  const totalUsers = stats?.totalUsers || 0;
  const planTotal = (pd.free || 0) + (pd.professional || 0) + (pd.corporate || 0);

  const PLAN_BARS = [
    { key: "free", label: "Free Plan", icon: Zap, gradient: "from-slate-400 to-slate-600", bg: "bg-slate-500" },
    { key: "professional", label: "Professional", icon: Star, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-500" },
    { key: "corporate", label: "Corporate", icon: Crown, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in-0 duration-500">
        {/* Skeleton metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-200 bg-red-50 py-20 text-center">
        <Activity className="h-10 w-10 text-red-400" />
        <p className="text-lg font-bold text-red-700">Veriler yüklenemedi</p>
        <p className="text-sm text-red-500">Bağlantıyı kontrol edin ve tekrar deneyin.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">

      {/* ── Page header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-7 py-8 text-white shadow-2xl animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
              <Sparkles className="h-3 w-3" />
              Admin Paneli
            </span>
            <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">Genel Bakış</h1>
            <p className="mt-1 text-sm text-slate-400">Tüm platform verilerini buradan takip edin.</p>
            <p className="mt-2 text-xs text-slate-500">
              Son güncelleme: {new Date().toLocaleTimeString("tr-TR")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Link href="/admin/users">
                <Users className="mr-2 h-3.5 w-3.5" />
                Kullanıcılar
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Yenile
            </Button>
          </div>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard icon={Users} iconGradient="from-violet-500 to-purple-700" label="Toplam Kullanıcı" value={stats?.totalUsers} linkHref="/admin/users" stagger={0} />
        <MetricCard icon={Building2} iconGradient="from-blue-500 to-indigo-600" label="Toplam İlan" value={stats?.totalListings} linkHref="/admin/listings" stagger={60} />
        <MetricCard icon={CheckCircle2} iconGradient="from-emerald-500 to-green-600" label="Aktif İlan" value={stats?.activeListings} sub={`${stats?.totalListings ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0}% aktif`} subClass="text-emerald-600" linkHref="/admin/listings" stagger={120} />
        <MetricCard icon={Eye} iconGradient="from-rose-500 to-red-600" label="Pasif İlan" value={stats?.inactiveListings} linkHref="/admin/listings" stagger={180} />
        <MetricCard icon={MessageSquare} iconGradient="from-orange-500 to-amber-600" label="Okunmamış Mesaj" value={stats?.unreadContacts} sub={stats?.unreadContacts > 0 ? "Yanıt bekliyor" : "Tümü okundu"} subClass={stats?.unreadContacts > 0 ? "text-orange-600" : "text-emerald-600"} linkHref="/admin/contacts" stagger={240} />
        <MetricCard icon={Bell} iconGradient="from-pink-500 to-rose-600" label="Bülten Abonesi" value={stats?.totalNewsletters} linkHref="/admin/newsletters" stagger={300} />
      </div>

      {/* ── Plan distribution ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {PLAN_BARS.map((p, i) => {
          const count = pd[p.key] || 0;
          const pct = planTotal > 0 ? Math.round((count / planTotal) * 100) : 0;
          const Icon = p.icon;
          return (
            <div
              key={p.key}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-sm card-entrance hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{p.label}</p>
                  <p className="text-xs text-slate-500">{fmt(count)} kullanıcı · {pct}%</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>Kullanım</span>
                  <span className="font-bold text-foreground">{pct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${p.bg} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold tabular-nums text-foreground">
                <AnimatedNumber value={count} />
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Recent users + recent listings ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent users */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow">
                <Users className="h-4 w-4 text-white" />
              </span>
              <p className="font-bold text-foreground">Son Üyeler</p>
            </div>
            <Link href="/admin/users" className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition hover:underline">
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/40">
            {(stats?.recentUsers || []).slice(0, 6).map((u) => (
              <div key={u._id} className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/50">
                <Avatar className="h-9 w-9 shrink-0 ring-2 ring-accent/10">
                  <AvatarImage src={u.avatarUrl || ""} alt={u.name} />
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-[10px] font-black text-accent">
                    {initials(u.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{u.name}</p>
                  <p className="truncate text-xs text-slate-500">{u.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <RoleBadge role={u.role} />
                  <PlanBadge plan={u.subscription?.plan || "free"} />
                </div>
                <p className="ml-1 shrink-0 text-[10px] text-slate-400 hidden sm:block">
                  {formatDate(u.createdAt)}
                </p>
              </div>
            ))}
            {(!stats?.recentUsers?.length) && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-slate-400">
                <Users className="h-7 w-7 text-slate-300" />
                Henüz kullanıcı yok
              </div>
            )}
          </div>
        </div>

        {/* Recent listings */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow">
                <Building2 className="h-4 w-4 text-white" />
              </span>
              <p className="font-bold text-foreground">Son İlanlar</p>
            </div>
            <Link href="/admin/listings" className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition hover:underline">
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border/40">
            {(stats?.recentListings || []).slice(0, 5).map((l) => (
              <div key={l._id} className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50/50">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {l.images?.[0] && (
                    <img src={l.images[0]} alt={l.title} className="h-full w-full object-cover" />
                  )}
                  {!l.images?.[0] && (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="h-5 w-5 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{l.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {l.owner?.name || "—"} · {formatDate(l.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${l.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {l.isActive ? "Aktif" : "Pasif"}
                  </span>
                  <span className="text-xs font-bold text-accent tabular-nums">
                    {formatTry(l.price)}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentListings?.length) && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-slate-400">
                <Building2 className="h-7 w-7 text-slate-300" />
                Henüz ilan yok
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Activity strip: unread contacts ── */}
      {(stats?.unreadContacts || 0) > 0 && (
        <Link
          href="/admin/contacts"
          className="flex items-center gap-4 overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 animate-in fade-in-0 duration-500"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30">
            <MessageSquare className="h-5 w-5 text-white" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-orange-900">
              {stats.unreadContacts} okunmamış mesaj var
            </p>
            <p className="text-sm text-orange-600">Yanıt verilmemiş iletişim formları bekliyor</p>
          </div>
          <ArrowRight className="h-5 w-5 text-orange-400 shrink-0" />
        </Link>
      )}

      {/* ── Quick actions ── */}
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Hızlı Erişim</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { href: "/admin/users", icon: Users, label: "Kullanıcılar", gradient: "from-violet-500 to-purple-700", count: fmt(stats?.totalUsers) },
            { href: "/admin/listings", icon: Building2, label: "İlanlar", gradient: "from-blue-500 to-indigo-600", count: fmt(stats?.totalListings) },
            { href: "/admin/contacts", icon: Mail, label: "Mesajlar", gradient: "from-orange-500 to-amber-500", count: fmt(stats?.unreadContacts) },
            { href: "/admin/newsletters", icon: Bell, label: "Bülten", gradient: "from-pink-500 to-rose-600", count: fmt(stats?.totalNewsletters) },
            { href: "/", icon: Globe, label: "Siteyi Gör", gradient: "from-slate-600 to-slate-800", count: "→" },
          ].map(({ href, icon: Icon, label, gradient, count }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-accent/30"
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{label}</p>
                <p className="text-xs font-semibold text-accent">{count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats overview bar ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-6 py-5 shadow-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: TrendingUp, label: "İlan Doluluk Oranı", value: `${stats?.totalListings ? Math.round((stats.activeListings / stats.totalListings) * 100) : 0}%`, color: "text-emerald-600" },
            { icon: BarChart2, label: "Pro + Corp Oranı", value: `${totalUsers > 0 ? Math.round(((pd.professional || 0) + (pd.corporate || 0)) / totalUsers * 100) : 0}%`, color: "text-blue-600" },
            { icon: Activity, label: "Pasif İlan Oranı", value: `${stats?.totalListings ? Math.round((stats.inactiveListings / stats.totalListings) * 100) : 0}%`, color: "text-rose-500" },
            { icon: Users, label: "Ortalama Plan", value: pd.corporate > pd.professional ? "Corporate" : pd.professional > pd.free ? "Pro Mix" : "Free Ağırlıklı", color: "text-amber-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className={`h-5 w-5 shrink-0 ${color}`} />
              <div>
                <p className="text-sm font-bold text-foreground">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
