"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ArrowRight,
  ArrowUp,
  Building2,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/properties", label: "İlanlar" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Biz Kimiz" },
  { href: "/contact", label: "İletişim" },
];

const categories = [
  { href: "/properties?listingType=sale&type=apartment", label: "Satılık Daire" },
  { href: "/properties?listingType=rent&type=house", label: "Kiralık Ev" },
  { href: "/properties?type=commercial", label: "Ticari İmarlar" },
  { href: "/properties?type=land", label: "Arsa İlanları" },
  { href: "/properties?listingType=sale&type=house", label: "Satılık Villa" },
];

const socials = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook", color: "hover:border-blue-400 hover:text-blue-400" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram", color: "hover:border-pink-400 hover:text-pink-400" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", color: "hover:border-blue-500 hover:text-blue-500" },
  { href: "https://twitter.com", icon: Twitter, label: "X", color: "hover:border-slate-300 hover:text-slate-200" },
];

const schema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin"),
});

export default function Footer() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values) {
    try {
      const res = await api.post("/newsletter/subscribe", values);
      toast.success(res?.data?.message || "Bültene başarıyla abone oldunuz.");
      form.reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bülten aboneliği alınamadı.");
    }
  }

  return (
    <footer className="mt-20 bg-[var(--header)] text-slate-200">
      {/* Animated gold top border */}
      <div className="border-top-gold" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Premium band */}
      <div className="border-b border-white/5 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Türkiye'nin Premium Gayrimenkul Platformu</span>
          </div>
          <div className="hidden items-center gap-4 text-xs text-white/40 sm:flex">
            <span>7/24 Destek</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Lisanslı & Onaylı</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Güvenli İşlem</span>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 xl:grid-cols-4">

        {/* Brand column */}
        <section className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-amber-500/20 ring-1 ring-accent/30 transition group-hover:ring-accent/60">
              <Building2 className="h-4.5 w-4.5 text-accent" />
            </span>
            <span className="text-xl">
              <span className="font-extrabold text-accent">Vera</span>{" "}
              <span className="font-light text-white">Real Estate</span>
            </span>
          </Link>

          <p className="text-sm leading-relaxed text-slate-400">
            Premium gayrimenkul deneyimiyle hayalinizdeki evi bulun. Güvenilir danışmanlık, şeffaf süreç.
          </p>

          <ul className="space-y-2.5">
            <li className="inline-flex items-start gap-2.5 text-sm text-slate-300 transition hover:text-accent">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Konya Selçuklu · İstanbul Levent</span>
            </li>
            <li>
              <a href="tel:+905300000000" className="inline-flex items-center gap-2.5 text-sm text-slate-300 transition hover:text-accent">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                +90 530 000 00 00
              </a>
            </li>
            <li>
              <a href="mailto:info@vera.com" className="inline-flex items-center gap-2.5 text-sm text-slate-300 transition hover:text-accent">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                info@vera.com
              </a>
            </li>
          </ul>
        </section>

        {/* Quick links */}
        <section>
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            Hızlı Bağlantılar
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-all duration-200 hover:text-accent"
                >
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
                  <span className="transition-all duration-200 group-hover:translate-x-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Categories */}
        <section>
          <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            Kategoriler
          </h3>
          <ul className="space-y-2.5">
            {categories.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-all duration-200 hover:text-accent"
                >
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
                  <span className="transition-all duration-200 group-hover:translate-x-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Newsletter + Social */}
        <section className="space-y-5">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            Bülten & Sosyal Medya
          </h3>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {socials.map(({ href, icon: Icon, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl border border-slate-700 text-slate-400 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-black/20 ${color}`}
                aria-label={label}
              >
                {/* Shimmer sweep on hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <Icon className="relative h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Newsletter form */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Emlak piyasası haberleri ve fırsat ilanları için abone olun.
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  {...form.register("email")}
                  className="border-slate-700 bg-slate-800/80 pl-9 text-white placeholder:text-slate-500 focus-visible:border-accent/60 focus-visible:ring-accent/30"
                />
              </div>
              {form.formState.errors.email?.message && (
                <p className="text-xs text-amber-300">{form.formState.errors.email.message}</p>
              )}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-gold-gradient font-semibold text-primary transition hover:brightness-95"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Abone Ol
              </Button>
            </form>
          </div>
        </section>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Vera Real Estate. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="transition hover:text-white">
              Gizlilik Politikası
            </Link>
            <span className="h-3 w-px bg-white/10" />
            <Link href="/terms-of-service" className="transition hover:text-white">
              Kullanım Şartları
            </Link>
            <span className="h-3 w-px bg-white/10" />
            {/* Scroll to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 font-medium text-slate-400 transition-all duration-200 hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
              aria-label="Sayfanın başına dön"
            >
              <ArrowUp className="h-3 w-3" />
              Başa Dön
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
