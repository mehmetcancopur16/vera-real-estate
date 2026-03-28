"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Crown,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { getAdminStats } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function PlanBadge({ plan }) {
  const styles = {
    free: "bg-slate-100 text-slate-600 border-slate-200",
    professional: "bg-blue-50 text-blue-700 border-blue-200",
    corporate: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const labels = { free: "Free", professional: "Pro", corporate: "Corp" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[plan] || styles.free}`}>
      {labels[plan] || plan}
    </span>
  );
}

function StatCard({ icon: Icon, iconClass, label, value, sub, subClass = "text-slate-500", href }) {
  const content = (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md ${href ? "cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900 tabular-nums">
            {value?.toLocaleString("tr-TR") ?? "—"}
          </p>
          {sub && <p className={`mt-1 text-xs font-medium ${subClass}`}>{sub}</p>}
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl shadow-md ${iconClass}`}>
          <Icon className="h-5 w-5 text-white" />
        </span>
      </div>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function initialsFromName(name) {
  if (!name) return "??";
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    staleTime: 30_000,
  });

  const stats = data?.data;

  const planDistTotal = stats
    ? (stats.planDistribution?.free || 0) + (stats.planDistribution?.professional || 0) + (stats.planDistribution?.corporate || 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Genel Bakış</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Vera Real Estate — Tüm sistem istatistikleri
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Yenile
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Veriler yüklenirken hata oluştu. Lütfen tekrar deneyin.
        </div>
      )}

      {/* Stat cards — row 1: core */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Users}
          iconClass="bg-gradient-to-br from-blue-500 to-indigo-600"
          label="Toplam Kullanıcı"
          value={isLoading ? null : stats?.totalUsers}
          sub="Kayıtlı üyeler"
          href="/admin/users"
        />
        <StatCard
          icon={Building2}
          iconClass="bg-gradient-to-br from-emerald-500 to-teal-600"
          label="Toplam İlan"
          value={isLoading ? null : stats?.totalListings}
          sub={`${stats?.activeListings ?? "—"} aktif`}
          subClass="text-emerald-600"
          href="/admin/listings"
        />
        <StatCard
          icon={Activity}
          iconClass="bg-gradient-to-br from-orange-500 to-rose-600"
          label="Pasif İlan"
          value={isLoading ? null : stats?.inactiveListings}
          sub="Yayında değil"
          subClass="text-orange-500"
          href="/admin/listings"
        />
        <StatCard
          icon={TrendingUp}
          iconClass="bg-gradient-to-br from-violet-500 to-purple-600"
          label="Pro/Corp Üye"
          value={isLoading ? null : (stats?.planDistribution?.professional || 0) + (stats?.planDistribution?.corporate || 0)}
          sub="Ücretli aboneler"
          subClass="text-violet-600"
          href="/admin/users"
        />
      </div>

      {/* Stat cards — row 2: comms */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
        <StatCard
          icon={Bell}
          iconClass="bg-gradient-to-br from-orange-400 to-red-500"
          label="Okunmamış Mesaj"
          value={isLoading ? null : (stats?.unreadContacts ?? 0)}
          sub={stats?.unreadContacts > 0 ? "Yanıt bekliyor" : "Tümü okundu"}
          subClass={stats?.unreadContacts > 0 ? "text-red-500" : "text-emerald-600"}
          href="/admin/contacts"
        />
        <StatCard
          icon={Mail}
          iconClass="bg-gradient-to-br from-pink-500 to-rose-600"
          label="Newsletter Abonesi"
          value={isLoading ? null : (stats?.totalNewsletters ?? 0)}
          sub="Aktif aboneler"
          subClass="text-pink-600"
          href="/admin/newsletters"
        />
      </div>

      {/* Plan distribution + recent users */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Plan distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Plan Dağılımı</h2>
            <BarChart3 className="h-5 w-5 text-slate-300" />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { key: "free", label: "Free", limit: "3 ilan", color: "bg-slate-400", icon: Zap },
                { key: "professional", label: "Professional", limit: "7 ilan", color: "bg-blue-500", icon: Star },
                { key: "corporate", label: "Corporate", limit: "Sınırsız", color: "bg-amber-500", icon: Crown },
              ].map(({ key, label, limit, color, icon: PlanIcon }) => {
                const count = stats?.planDistribution?.[key] || 0;
                const pct = planDistTotal > 0 ? Math.round((count / planDistTotal) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <PlanIcon className="h-4 w-4 text-slate-400" />
                        {label}
                        <span className="text-xs text-slate-400">({limit})</span>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        {count} üye{" "}
                        <span className="text-xs font-medium text-slate-400">(%{pct})</span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent signups */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Son Kayıtlar</h2>
            <Link
              href="/admin/users"
              className="flex items-center gap-1 text-xs font-semibold text-violet-600 transition hover:text-violet-800"
            >
              Tümünü Gör <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(stats?.recentUsers || []).slice(0, 6).map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-2.5">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={u.avatarUrl || ""} alt={u.name} />
                    <AvatarFallback className="bg-slate-900 text-xs font-black text-white">
                      {initialsFromName(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{u.name}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <PlanBadge plan={u.subscription?.plan || "free"} />
                    {u.role === "admin" && (
                      <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent listings */}
      {stats?.recentListings?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Son Eklenen İlanlar</h2>
            <Link
              href="/admin/listings"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 transition hover:text-emerald-800"
            >
              Tümünü Gör <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {stats.recentListings.slice(0, 5).map((listing) => (
              <div key={listing._id} className="flex items-center gap-3 py-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{listing.title}</p>
                  <p className="truncate text-xs text-slate-400">
                    {listing.owner?.name || "—"} · {formatDate(listing.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${listing.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {listing.isActive ? "Aktif" : "Pasif"}
                  </span>
                  {listing.price && (
                    <span className="text-xs font-bold text-slate-700">
                      {listing.price.toLocaleString("tr-TR")} ₺
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/users", label: "Kullanıcı Yönetimi", desc: "Rolleri ve planları düzenle", icon: Users, color: "from-blue-500 to-indigo-600" },
          { href: "/admin/listings", label: "İlan Yönetimi", desc: "İlanları onayla veya sil", icon: Building2, color: "from-emerald-500 to-teal-600" },
          { href: "/admin/contacts", label: "Mesajlar", desc: "İletişim formlarını görüntüle", icon: MessageSquare, color: "from-orange-500 to-rose-600" },
          { href: "/admin/newsletters", label: "Newsletter", desc: "Bülten abonelerini yönet", icon: Mail, color: "from-pink-500 to-rose-600" },
          { href: "/properties", label: "Siteyi Görüntüle", desc: "Kullanıcı deneyimini kontrol et", icon: Shield, color: "from-violet-500 to-purple-600" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${item.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
