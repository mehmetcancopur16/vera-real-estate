import Link from "next/link";
import { Building2, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/properties", label: "Ilanlar" },
  { href: "/about", label: "Biz Kimiz" },
  { href: "/blog", label: "Blog" },
];

const categories = [
  { href: "/properties?listingType=sale&type=apartment", label: "Satilik Daire" },
  { href: "/properties?listingType=rent&type=house", label: "Kiralik Ev" },
  { href: "/properties?type=commercial", label: "Ticari Imarlar" },
  { href: "/properties?type=land", label: "Arsa Ilanlari" },
];

const socials = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://x.com", icon: Twitter, label: "X" },
];

const linkClass =
  "text-sm text-slate-300 transition-colors hover:text-white";

export default function Footer() {
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
          <p className="text-sm text-slate-400">Modern Yasamin Yeni Koordinati</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-accent" />
              Konya Selcuklu, Istanbul Levent
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
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
            Takip Et & Bulten
          </h3>
          <div className="flex items-center gap-3">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-accent hover:text-accent"
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <form className="space-y-2">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-accent to-[var(--gold-hover)] text-primary hover:from-[var(--gold-hover)] hover:to-accent"
            >
              <Send className="mr-2 h-4 w-4" />
              E-Bultene Abone Ol
            </Button>
          </form>
        </section>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} Vera Real Estate. Tum haklari saklidir.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-white">
              Gizlilik Politikasi
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Kullanim Sartlari
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
