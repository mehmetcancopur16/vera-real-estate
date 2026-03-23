"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PlusSquare, UserCircle2, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const items = [
  { href: "/my-listings", label: "Ilanlarim", icon: LayoutDashboard },
  { href: "/add-listing", label: "Yeni Ilan Ekle", icon: PlusSquare },
  { href: "/profile", label: "Profil", icon: UserCircle2 },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, logout, user } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setAuthChecked(true));
  }, [checkAuth]);

  useEffect(() => {
    if (authChecked && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authChecked, isAuthenticated, isLoading, router]);

  if (!authChecked || isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Yetki kontrol ediliyor...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[250px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-4">
          <div className="mb-4 border-b border-border pb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
            <p className="mt-2 font-medium">{user?.name || "Kullanici"}</p>
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    active ? "bg-primary text-primary-foreground" : "hover:bg-muted/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/20"
          >
            <LogOut className="h-4 w-4" />
            Cikis Yap
          </button>
        </aside>

        <main className="rounded-xl border border-border bg-card p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
