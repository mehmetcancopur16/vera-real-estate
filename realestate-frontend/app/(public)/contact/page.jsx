"use client";

import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Twitter,
  User,
  FileText,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createContactMessage } from "@/services/contact.service";

const schema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı."),
  email: z.string().trim().email("Geçerli bir e-posta girin."),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(3, "Konu en az 3 karakter olmalı."),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı."),
});

const offices = [
  {
    city: "İstanbul",
    title: "Genel Merkez",
    address: "Levent Mah. Büyükdere Cad. No:185, Şişli / İstanbul",
    phone: "+90 (212) 555 12 34",
    email: "istanbul@veraestate.com",
    hours: "Pzt–Cum: 09:00–19:00",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "Ankara",
    title: "Ankara Şubesi",
    address: "Çankaya Mah. Atatürk Bulvarı No:98, Çankaya / Ankara",
    phone: "+90 (312) 555 12 34",
    email: "ankara@veraestate.com",
    hours: "Pzt–Cum: 09:00–18:30",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop",
  },
  {
    city: "İzmir",
    title: "İzmir Şubesi",
    address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:64, Konak / İzmir",
    phone: "+90 (232) 555 12 34",
    email: "izmir@veraestate.com",
    hours: "Pzt–Cum: 09:00–18:00",
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=800&auto=format&fit=crop",
  },
];

const faqs = [
  {
    q: "Danışmanlık hizmeti ücretli mi?",
    a: "İlk görüşmemiz tamamen ücretsizdir. Portföy analizi, lokasyon değerlendirmesi ve yatırım önerileri için ilk oturumu ücretsiz sunuyoruz.",
  },
  {
    q: "Ne kadar sürede geri dönüş yapılıyor?",
    a: "Mesaj ve e-posta başvurularına en geç 4 saat içinde, telefon taleplerinde ise anında geri dönüş sağlıyoruz.",
  },
  {
    q: "Sadece İstanbul'da mı hizmet veriyorsunuz?",
    a: "Hayır. İstanbul, Ankara ve İzmir şubelerimizin yanı sıra Türkiye genelinde 20+ şehirde saha danışmanlarımız aracılığıyla hizmet sunuyoruz.",
  },
  {
    q: "Kira yönetimi hizmeti de veriyor musunuz?",
    a: "Evet. Yatırım amaçlı mülklerde kiracı bulma, kira takibi ve mülk yönetimi hizmetlerini kapsamlı danışmanlık paketlerimizde sunuyoruz.",
  },
];

const socials = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram", color: "hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", color: "hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50" },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook", color: "hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50" },
  { href: "https://twitter.com", icon: Twitter, label: "X / Twitter", color: "hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50" },
];

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values) {
    try {
      await createContactMessage(values);
      toast.success("Mesajınız başarıyla iletildi! Ekibimiz en kısa sürede size geri dönecek.");
      form.reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Mesaj gönderilirken bir hata oluştu.");
    }
  }

  return (
    <div className="space-y-20 pb-12">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl premium-ring">
        <div className="relative min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1800&auto=format&fit=crop"
            alt="Vera İletişim"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,175,55,0.12),transparent_60%)]" />
          <div className="absolute inset-0 flex items-center px-8 py-12 md:px-14">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-accent" />
                Vera Real Estate
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">
                Bize Ulaşın
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                Yeni bir yaşam alanı, yatırım fırsatı veya portföy yönetimi hakkında uzman
                ekibimizle hemen iletişime geçin. İlk görüşme tamamen ücretsiz.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <a href="tel:+902125551234" className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent/80">
                  <Phone className="h-4 w-4" />
                  +90 (212) 555 12 34
                </a>
                <a href="mailto:iletisim@veraestate.com" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
                  <Mail className="h-4 w-4" />
                  iletisim@veraestate.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: MessageSquare, title: "4 Saat İçinde Yanıt", desc: "Mesaj ve e-postalarınıza en geç 4 saat içinde geri dönüş garantisi.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { icon: Phone, title: "7/24 Telefon Desteği", desc: "Acil durumlar ve anlık sorularınız için her zaman ulaşabileceğiniz bir hat.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { icon: CheckCircle2, title: "Ücretsiz İlk Görüşme", desc: "Portföy analizi ve yatırım danışmanlığında ilk görüşme tamamen ücretsiz.", color: "text-accent", bg: "bg-amber-50", border: "border-amber-100" },
        ].map((item) => (
          <div
            key={item.title}
            className={`flex items-start gap-4 rounded-2xl border ${item.border} bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className={`shrink-0 rounded-2xl ${item.bg} p-3`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="font-bold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── FORM + BİLGİLER ── */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">

        {/* ── FORM ── */}
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-sm ring-1 ring-slate-200/50">
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              <Send className="h-3 w-3" />
              Mesaj Gönderin
            </span>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Nasıl Yardımcı Olabiliriz?</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Talebinizi bize iletin; uzman danışmanımız en kısa sürede sizi arasın.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800">Ad Soyad</FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            {...field}
                            placeholder="Adınız Soyadınız"
                            className="h-11 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/70 focus-visible:ring-accent/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800">E-posta</FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            type="email"
                            {...field}
                            placeholder="ornek@vera.com"
                            className="h-11 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/70 focus-visible:ring-accent/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800">
                        Telefon{" "}
                        <span className="font-normal text-slate-400">(opsiyonel)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            type="tel"
                            {...field}
                            placeholder="+90 5xx xxx xx xx"
                            className="h-11 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/70 focus-visible:ring-accent/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-800">Konu</FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            {...field}
                            placeholder="Danışmanlık, ilan, diğer..."
                            className="h-11 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/70 focus-visible:ring-accent/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-800">Mesajınız</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <FileText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Mülk tercihleri, lokasyon, bütçe veya diğer taleplerinizi yazın..."
                          className="border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/70 focus-visible:ring-accent/20 resize-none leading-relaxed"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full gap-2 rounded-xl bg-gold-gradient font-bold text-slate-900 shadow-md shadow-amber-200/30 transition-all hover:brightness-95 hover:shadow-lg active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Mesaj Gönder
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="space-y-4">
          {/* Contact info */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Genel Merkez — İstanbul</h3>
            </div>
            <ul className="space-y-4">
              {[
                { icon: MapPin, label: "Adres", value: "Levent Mah. Büyükdere Cad. No:185, Şişli / İstanbul", href: null },
                { icon: Phone, label: "Telefon", value: "+90 (212) 555 12 34", href: "tel:+902125551234" },
                { icon: Mail, label: "E-posta", value: "iletisim@veraestate.com", href: "mailto:iletisim@veraestate.com" },
                { icon: Clock3, label: "Çalışma Saatleri", value: "Pzt–Cum: 09:00–19:00 · Cmt: 10:00–16:00", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0 rounded-xl bg-accent/10 p-2.5">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    {href ? (
                      <a href={href} className="mt-0.5 block text-sm font-medium text-slate-700 hover:text-accent transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-slate-700">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Social media */}
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="mb-4 text-sm font-bold text-foreground">Sosyal Medyada Takip Edin</p>
            <div className="grid grid-cols-2 gap-2">
              {socials.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 rounded-xl border border-border/60 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${color}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick call CTA */}
          <div className="overflow-hidden rounded-2xl bg-primary premium-ring">
            <div className="relative p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(212,175,55,0.12),transparent_70%)]" />
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Hemen Arayın</p>
              <p className="mt-2 text-lg font-bold text-white">Uzman Danışman Hattı</p>
              <p className="mt-1.5 text-sm text-slate-400">
                Acil sorular ve randevu talepleriniz için doğrudan arayın.
              </p>
              <a
                href="tel:+902125551234"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3 text-base font-bold text-slate-900 shadow-lg transition hover:brightness-110 active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" />
                +90 (212) 555 12 34
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFİSLER ── */}
      <section>
        <div className="mb-8">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-accent">Şubelerimiz</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ofislerimiz</h2>
          <p className="mt-2 text-base text-slate-500">Türkiye&apos;nin üç büyük şehrinde hizmetinizdeyiz.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {offices.map((office) => (
            <div
              key={office.city}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={office.image}
                  alt={office.city}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-lg font-bold text-white">{office.city}</p>
                  <p className="text-xs text-accent">{office.title}</p>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-slate-600">{office.address}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="text-sm font-medium text-slate-700 hover:text-accent transition-colors">
                    {office.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  <a href={`mailto:${office.email}`} className="text-sm font-medium text-slate-700 hover:text-accent transition-colors">
                    {office.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock3 className="h-4 w-4 shrink-0 text-accent" />
                  <p className="text-sm text-slate-500">{office.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SSS ── */}
      <section>
        <div className="mb-8 text-center">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-accent">Sık Sorulan Sorular</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Merak Ettikleriniz</h2>
          <p className="mx-auto mt-2 max-w-lg text-base text-slate-500">
            En çok sorulan sorular ve cevapları. Daha fazlası için bizimle iletişime geçin.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:border-accent/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-foreground">{faq.q}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center md:px-10 premium-ring">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Bir Adım Uzağınızdayız</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Hayalinizdeki Mülkü Birlikte Bulalım
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            Uzman danışmanlarımız sizi dinlesin, size özel portföy analizi ve yatırım yol haritası hazırlasın.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="tel:+902125551234"
              className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-3 text-base font-bold text-slate-900 shadow-lg transition hover:brightness-110"
            >
              <Phone className="h-4 w-4" />
              Hemen Arayın
            </a>
            <a
              href="mailto:iletisim@veraestate.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3 text-base font-semibold text-white transition hover:border-accent hover:bg-white/10 hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              E-posta Gönderin
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
