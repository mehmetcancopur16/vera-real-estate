"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PlusSquare, UserCircle2, LogOut, Menu, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <div>
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card md:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <p className="font-medium">Dashboard</p>
          <Sheet>
            <SheetTrigger
              aria-label="menu"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted/20"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[290px]">
              <SheetHeader>
                <SheetTitle>Kullanici Paneli</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{SidebarContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-61px)] w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:min-h-screen md:grid-cols-[250px_1fr]">
        <aside className="hidden rounded-xl border border-border bg-card p-4 md:block">{SidebarContent}</aside>
        <main className="rounded-xl border border-border bg-card p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
