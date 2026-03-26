"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRound, LayoutDashboard, LogOut, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  { href: "/properties", label: "Ilanlar" },
  { href: "/about", label: "Hakkimizda" },
  { href: "/contact", label: "Iletisim" },
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
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VR";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-[var(--header)] text-primary-foreground backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="text-xl tracking-wide transition-transform duration-200 hover:scale-[1.01] md:text-2xl">
          <span className="font-semibold text-gradient-gold">Vera</span>{" "}
          <span className="font-light text-primary-foreground">Real Estate</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="group relative px-1 py-1 text-sm font-medium text-white/85 transition-colors duration-200 hover:text-accent">
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-center scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {isAuthenticated ? (
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full ring-2 ring-accent/35 transition-all duration-200 hover:-translate-y-0.5 hover:ring-accent"
                aria-label="user-menu"
              >
                <Avatar className="size-9 bg-accent text-primary">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="rounded-lg bg-surface px-2.5 py-2">
                  <p className="text-xs font-medium text-foreground">{user?.name || "Vera Uye"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{user?.email || "Hesap"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <CircleUserRound className="mr-2 h-4 w-4" />
                  Profilim
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-listings")} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Ilanlarim
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-700"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cikis Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gold-gradient text-primary premium-ring hover:brightness-95"
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        )}

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="menu"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border/60 bg-[var(--header)] text-white">
              <SheetHeader>
                <SheetTitle>
                  <span className="font-semibold text-accent">Vera</span>{" "}
                  <span className="font-light text-white">Real Estate</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-sm text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="grid gap-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Button asChild variant="secondary" className="justify-start">
                        <Link href="/my-listings">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Ilanlarim
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className="justify-start">
                        <Link href="/profile">
                          <UserRound className="mr-2 h-4 w-4" />
                          Profilim
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        onClick={() => {
                          logout();
                          router.push("/login");
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cikis Yap
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="secondary">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-gold-gradient text-primary hover:brightness-95"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
