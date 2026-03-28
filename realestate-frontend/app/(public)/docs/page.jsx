"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Book,
  Code2,
  ExternalLink,
  Key,
  RefreshCw,
  Server,
  Shield,
  Zap,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5050";
const DOCS_URL = `${API_BASE}/docs`;
const HEALTH_URL = `${API_BASE}/api/health`;

const endpoints = [
  {
    tag: "Auth",
    color: "from-violet-500 to-purple-600",
    icon: Key,
    routes: [
      { method: "POST", path: "/api/auth/register", desc: "Yeni kullanıcı kaydı" },
      { method: "POST", path: "/api/auth/login", desc: "Giriş — JWT döner" },
      { method: "GET", path: "/api/auth/me", desc: "Profil bilgisi (JWT)" },
      { method: "PATCH", path: "/api/auth/me", desc: "Profil güncelle" },
      { method: "PATCH", path: "/api/auth/password", desc: "Şifre değiştir" },
      { method: "POST", path: "/api/auth/avatar", desc: "Avatar yükle" },
      { method: "DELETE", path: "/api/auth/me", desc: "Hesabı sil" },
    ],
  },
  {
    tag: "Properties",
    color: "from-emerald-500 to-teal-600",
    icon: Code2,
    routes: [
      { method: "GET", path: "/api/properties", desc: "İlanları listele (filtreli)" },
      { method: "GET", path: "/api/properties/featured", desc: "Öne çıkan ilanlar" },
      { method: "GET", path: "/api/properties/my", desc: "Kendi ilanlarım" },
      { method: "GET", path: "/api/properties/:id", desc: "İlan detayı" },
      { method: "POST", path: "/api/properties", desc: "Yeni ilan oluştur" },
      { method: "PUT", path: "/api/properties/:id", desc: "İlan güncelle" },
      { method: "DELETE", path: "/api/properties/:id", desc: "İlan sil" },
      { method: "POST", path: "/api/properties/:id/images", desc: "Görsel yükle" },
      { method: "DELETE", path: "/api/properties/:id/images/:imgId", desc: "Görsel sil" },
    ],
  },
  {
    tag: "Contact",
    color: "from-orange-500 to-rose-600",
    icon: Book,
    routes: [
      { method: "POST", path: "/api/contact", desc: "İletişim formu gönder" },
    ],
  },
  {
    tag: "Newsletter",
    color: "from-pink-500 to-rose-600",
    icon: Zap,
    routes: [
      { method: "POST", path: "/api/newsletter/subscribe", desc: "Bültene abone ol" },
    ],
  },
  {
    tag: "Subscription",
    color: "from-amber-500 to-orange-600",
    icon: Shield,
    routes: [
      { method: "GET", path: "/api/subscription/plans", desc: "Mevcut planları listele" },
      { method: "POST", path: "/api/subscription/upgrade", desc: "Plan yükselt (JWT)" },
    ],
  },
  {
    tag: "Admin",
    color: "from-blue-500 to-indigo-600",
    icon: Server,
    routes: [
      { method: "GET", path: "/api/admin/stats", desc: "Dashboard istatistikleri" },
      { method: "GET", path: "/api/admin/users", desc: "Kullanıcıları listele" },
      { method: "PATCH", path: "/api/admin/users/:id", desc: "Kullanıcı güncelle" },
      { method: "DELETE", path: "/api/admin/users/:id", desc: "Kullanıcı sil" },
      { method: "GET", path: "/api/admin/listings", desc: "Tüm ilanlar" },
      { method: "PATCH", path: "/api/admin/listings/:id/toggle", desc: "Aktif/pasif yap" },
      { method: "DELETE", path: "/api/admin/listings/:id", desc: "İlan sil" },
      { method: "GET", path: "/api/admin/contacts", desc: "İletişim mesajları" },
      { method: "PATCH", path: "/api/admin/contacts/:id/read", desc: "Okundu işaretle" },
      { method: "DELETE", path: "/api/admin/contacts/:id", desc: "Mesaj sil" },
      { method: "GET", path: "/api/admin/newsletters", desc: "Newsletter aboneleri" },
      { method: "DELETE", path: "/api/admin/newsletters/:id", desc: "Abone sil" },
    ],
  },
];

const methodColors = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  PATCH: "bg-violet-100 text-violet-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function ApiDocsPage() {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch(HEALTH_URL);
      const data = await res.json();
      setHealth(data.success ? "online" : "error");
    } catch {
      setHealth("offline");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="py-10 space-y-10">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/70">
              <Book className="h-3 w-3" />
              REST API
            </div>
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Vera Real Estate{" "}
              <span className="text-amber-400">API Docs</span>
            </h1>
            <p className="mt-2 text-slate-400 max-w-xl">
              Full-stack emlak portalının tüm endpoint&apos;lerini keşfedin.
              Etkileşimli Swagger UI için aşağıdaki butona tıklayın.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg transition hover:brightness-110 hover:-translate-y-0.5"
            >
              <ExternalLink className="h-4 w-4" />
              Swagger UI Aç
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={`${API_BASE}/docs.json`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/20"
            >
              <Code2 className="h-4 w-4" />
              OpenAPI JSON
            </a>
          </div>
        </div>

        {/* Server status */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Base URL:</span>
            <code className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-mono text-amber-300">
              {API_BASE}/api
            </code>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Swagger UI:</span>
            <code className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-mono text-amber-300">
              {API_BASE}/docs
            </code>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={checkHealth}
              disabled={checking}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/20"
            >
              <RefreshCw className={`h-3 w-3 ${checking ? "animate-spin" : ""}`} />
              Health Check
            </button>
            {health && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                health === "online"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : health === "offline"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  health === "online" ? "bg-emerald-400 animate-pulse" :
                  health === "offline" ? "bg-red-400" : "bg-amber-400"
                }`} />
                {health === "online" ? "API Çevrimiçi" : health === "offline" ? "API Çevrimdışı" : "Hata"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Auth info */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <Key className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-900">JWT Bearer Kimlik Doğrulama</p>
            <p className="mt-1 text-xs text-amber-700">
              Korumalı endpoint&apos;leri kullanmak için önce{" "}
              <code className="rounded bg-amber-100 px-1 font-mono">POST /api/auth/login</code> ile token alın,
              ardından her istekte{" "}
              <code className="rounded bg-amber-100 px-1 font-mono">Authorization: Bearer &lt;token&gt;</code> header&apos;ı gönderin.
              Swagger UI&apos;da sağ üstteki <strong>Authorize</strong> butonunu kullanın.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoint groups */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">Tüm Endpoint&apos;ler</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {endpoints.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.tag} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className={`bg-gradient-to-r ${group.color} flex items-center gap-3 px-5 py-4`}>
                  <Icon className="h-5 w-5 text-white" />
                  <span className="text-sm font-extrabold text-white">{group.tag}</span>
                  <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                    {group.routes.length} endpoint
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {group.routes.map((route) => (
                    <div key={route.path + route.method} className="flex items-center gap-3 px-4 py-2.5">
                      <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${methodColors[route.method] || "bg-slate-100 text-slate-600"}`}>
                        {route.method}
                      </span>
                      <code className="min-w-0 flex-1 truncate text-xs font-mono text-slate-700">{route.path}</code>
                      <span className="shrink-0 text-[11px] text-slate-400 hidden sm:block">{route.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 py-12 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
          <Book className="h-7 w-7 text-amber-400" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Etkileşimli Dokümantasyon</h3>
        <p className="max-w-md text-sm text-slate-500">
          Swagger UI üzerinden endpoint&apos;leri doğrudan tarayıcıdan test edin, istek gövdelerini inceleyin ve canlı yanıtları görün.
        </p>
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3 text-sm font-extrabold text-amber-400 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <ExternalLink className="h-4 w-4" />
          Swagger UI&apos;yu Aç
        </a>
      </div>
    </div>
  );
}
