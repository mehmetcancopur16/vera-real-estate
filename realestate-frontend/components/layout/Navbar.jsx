"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/properties", label: "İlanlar" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((x) => x[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VR";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[var(--header)] text-primary-foreground backdrop-blur-xl">
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl tracking-wide transition-transform duration-200 hover:scale-[1.02] md:text-2xl"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-amber-500 shadow-lg shadow-amber-900/20">
            <Sparkles className="h-4 w-4 text-slate-900" />
          </span>
          <span>
            <span className="font-extrabold text-gradient-gold">Vera</span>{" "}
            <span className="font-light text-white/90">Real Estate</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              {item.label}
              <span className="absolute bottom-1 left-3 right-3 h-[1.5px] origin-center scale-x-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        {isAuthenticated ? (
          <div className="hidden items-center gap-2 md:flex">
            <Button
              asChild
              size="sm"
              className="bg-gold-gradient text-primary font-semibold shadow-sm hover:brightness-95"
            >
              <Link href="/add-listing">
                <Plus className="mr-1 h-3.5 w-3.5" />
                İlan Ekle
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-1.5 pl-2 pr-3 text-sm text-white transition-all duration-200 hover:bg-white/20 focus:outline-none"
                aria-label="user-menu"
              >
                <Avatar className="size-7 ring-1 ring-accent/50">
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "avatar"} />
                  <AvatarFallback className="bg-accent text-[10px] font-black text-slate-900">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[100px] truncate font-semibold lg:block">
                  {user?.name?.split(" ")[0] || "Hesap"}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
              >
                {/* User info header */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-4">
                  <Avatar className="size-11 ring-2 ring-accent/40">
                    <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "avatar"} />
                    <AvatarFallback className="bg-accent text-sm font-black text-slate-900">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {user?.name || "Vera Üye"}
                    </p>
                    <p className="truncate text-xs text-slate-400">{user?.email || "Hesap"}</p>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                      <Sparkles className="h-2.5 w-2.5" />
                      Premium Üye
                    </span>
                  </div>
                </div>

                <div className="p-2">
                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-slate-700 hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:text-violet-700"
                    onClick={() => router.push("/profile")}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                      <CircleUserRound className="h-4 w-4 text-violet-600" />
                    </span>
                    <span className="ml-2.5 font-semibold">Profilim</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700"
                    onClick={() => router.push("/my-listings")}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                      <LayoutDashboard className="h-4 w-4 text-blue-600" />
                    </span>
                    <span className="ml-2.5 font-semibold">İlanlarım</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700"
                    onClick={() => router.push("/add-listing")}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                      <Plus className="h-4 w-4 text-emerald-600" />
                    </span>
                    <span className="ml-2.5 font-semibold">Yeni İlan Ekle</span>
                  </DropdownMenuItem>

                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem
                        className="cursor-pointer rounded-xl px-3 py-2.5 text-slate-700 hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:text-violet-700"
                        onClick={() => router.push("/admin")}
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                          <Shield className="h-4 w-4 text-violet-600" />
                        </span>
                        <span className="ml-2.5 font-semibold">Admin Panel</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </span>
                    <span className="ml-2.5 font-semibold">Çıkış Yap</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/90 hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gold-gradient font-semibold text-primary shadow-sm hover:brightness-95"
            >
              <Link href="/register">Kayıt Ol</Link>
            </Button>
          </div>
        )}

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="menu"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l border-white/10 bg-[var(--header)] p-0 text-white"
            >
              <SheetHeader className="border-b border-white/10 px-5 py-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </span>
                  <span>
                    <span className="font-extrabold text-accent">Vera</span>{" "}
                    <span className="font-light text-white">Real Estate</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 p-4">
                {/* Nav links */}
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="my-2 h-px bg-white/10" />

                {/* Auth section */}
                {isAuthenticated ? (
                  <div className="space-y-1.5">
                    {/* User info */}
                    <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                      <Avatar className="size-10 ring-1 ring-accent/40">
                        <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "avatar"} />
                        <AvatarFallback className="bg-accent text-xs font-black text-slate-900">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">{user?.name || "Kullanıcı"}</p>
                        <p className="truncate text-xs text-slate-400">{user?.email || ""}</p>
                      </div>
                    </div>

                    <Button asChild className="w-full justify-start bg-gold-gradient text-primary font-semibold">
                      <Link href="/add-listing">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni İlan Ekle
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start bg-white/10 text-white hover:bg-white/20">
                      <Link href="/my-listings">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        İlanlarım
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start bg-white/10 text-white hover:bg-white/20">
                      <Link href="/profile">
                        <UserRound className="mr-2 h-4 w-4" />
                        Profilim
                      </Link>
                    </Button>
                    {user?.role === "admin" && (
                      <Button asChild variant="secondary" className="w-full justify-start bg-violet-500/20 text-violet-200 hover:bg-violet-500/30">
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => {
                        logout();
                        router.push("/login");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button asChild className="w-full" variant="secondary">
                      <Link href="/login">Giriş Yap</Link>
                    </Button>
                    <Button asChild className="w-full bg-gold-gradient text-primary font-semibold hover:brightness-95">
                      <Link href="/register">Kayıt Ol</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
