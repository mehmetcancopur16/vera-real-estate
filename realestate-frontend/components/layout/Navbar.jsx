"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/properties", label: "Ilanlar" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-wide">
          Vera Real Estate
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-white/90 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="secondary" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90">
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" aria-label="menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Vera Real Estate</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <nav className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted/30"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="grid gap-2 pt-4">
                  <Button asChild variant="secondary">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
