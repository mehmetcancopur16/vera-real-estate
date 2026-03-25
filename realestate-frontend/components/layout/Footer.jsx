"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter, Loader2 } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/properties", label: "İlanlar" },
  { href: "/about", label: "Biz Kimiz" },
  { href: "/blog", label: "Blog" },
];

const categories = [
  { href: "/properties?listingType=sale&type=apartment", label: "Satılık Daire" },
  { href: "/properties?listingType=rent&type=house", label: "Kiralık Ev" },
  { href: "/properties?type=commercial", label: "Ticari İmarlar" },
  { href: "/properties?type=land", label: "Arsa İlanları" },
];

const socials = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com", icon: Twitter, label: "X" },
];

const linkClass =
  "text-sm text-slate-300 transition-colors hover:text-white";

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
    <footer className="mt-14 bg-slate-950 text-slate-200">
      <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 xl:grid-cols-4">
        <section className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xl">
            <Building2 className="h-5 w-5 text-accent" />
            <span className="font-semibold text-accent">Vera</span>
            <span className="font-light text-white">Real Estate</span>
          </Link>
          <p className="text-sm text-slate-400">Premium Gayrimenkul Deneyimi</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" />
              Konya Selçuklu, İstanbul Levent
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              +90 530 000 00 00
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              info@vera.com
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Hizli Linkler
          </h3>
          <ul className="space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Kategoriler
          </h3>
          <ul className="space-y-2">
            {categories.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Takip Et & Bülten</h3>
          <div className="flex items-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition-transform hover:border-accent hover:text-accent hover:scale-110"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              {...form.register("email")}
              className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
            />
            {form.formState.errors.email?.message && (
              <p className="text-xs text-amber-300">{form.formState.errors.email.message}</p>
            )}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-gradient-to-r from-accent to-[var(--gold-hover)] text-primary hover:from-[var(--gold-hover)] hover:to-accent"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Bültene Abone Ol
            </Button>
          </form>
        </section>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-400 md:flex-row">
          <p>© 2026 Vera Real Estate. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="transition hover:text-white">
              Gizlilik Politikası
            </Link>
            <Link href="/terms-of-service" className="transition hover:text-white">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
