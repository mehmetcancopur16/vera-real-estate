"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-wide">
          Vera Real Estate
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-white/90 hover:text-white">
            Ana Sayfa
          </Link>
          <Link href="/properties" className="text-sm font-medium text-white/90 hover:text-white">
            Ilanlar
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
