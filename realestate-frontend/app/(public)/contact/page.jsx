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
  Twitter,
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
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://twitter.com", icon: Twitter, label: "X / Twitter" },
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
      toast.error(error?.response?.data?.message || "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
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
                <a
                  href="tel:+902125551234"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent/80"
                >
                  <Phone className="h-4 w-4" />
                  +90 (212) 555 12 34
                </a>
                <a
                  href="mailto:iletisim@veraestate.com"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                >
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
          { icon: MessageSquare, title: "4 Saat İçinde Yanıt", desc: "Mesaj ve e-postalarınıza en geç 4 saat içinde geri dönüş garantisi." },
          { icon: Phone, title: "7/24 Telefon Desteği", desc: "Acil durumlar ve anlık sorularınız için her zaman ulaşabileceğiniz bir hat." },
          { icon: CheckCircle2, title: "Ücretsiz İlk Görüşme", desc: "Portföy analizi ve yatırım danışmanlığında ilk görüşme tamamen ücretsiz." },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
          >
            <div className="shrink-0 rounded-2xl bg-accent/10 p-3">
              <item.icon className="h-5 w-5 text-accent" />
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

        {/* Form */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent">Mesaj Gönderin</p>
            <h2 className="text-2xl font-bold text-foreground">Nasıl Yardımcı Olabiliriz?</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Talebinizi bize iletin; uzman danışmanımız en kısa sürede sizi arasın.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700">Ad Soyad</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Adınız Soyadınız"
                          className="h-11 border-slate-300 focus-visible:ring-accent/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700">E-posta</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          placeholder="ornek@vera.com"
                          className="h-11 border-slate-300 focus-visible:ring-accent/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700">
                        Telefon{" "}
                        <span className="font-normal text-slate-400">(opsiyonel)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+90 5xx xxx xx xx"
                          className="h-11 border-slate-300 focus-visible:ring-accent/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-slate-700">Konu</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Satın Alma / Kiralama / Yatırım"
                          className="h-11 border-slate-300 focus-visible:ring-accent/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Mesajınız</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        {...field}
                        placeholder="Aradığınız mülk türü, bütçe aralığı, tercih ettiğiniz lokasyon veya sormak istediğiniz her şeyi yazabilirsiniz..."
                        className="resize-none border-slate-300 focus-visible:ring-accent/60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-gold-gradient font-bold text-slate-900 shadow-md hover:brightness-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Mesajı Gönder
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-400">
                Formunuz KVKK kapsamında gizlilik politikamıza uygun şekilde işlenir.
              </p>
            </form>
          </Form>
        </div>

        {/* Sağ panel */}
        <div className="space-y-5">
          {/* İletişim bilgileri */}
          <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <Building2 className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Genel Merkez — İstanbul</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0 rounded-xl bg-accent/10 p-2.5">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Adres</p>
                  <p className="mt-0.5 text-sm text-slate-700">Levent Mah. Büyükdere Cad. No:185, Şişli / İstanbul</p>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0 rounded-xl bg-accent/10 p-2.5">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Telefon</p>
                  <a href="tel:+902125551234" className="mt-0.5 block text-sm font-medium text-slate-700 hover:text-accent">
                    +90 (212) 555 12 34
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0 rounded-xl bg-accent/10 p-2.5">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">E-posta</p>
                  <a href="mailto:iletisim@veraestate.com" className="mt-0.5 block text-sm font-medium text-slate-700 hover:text-accent">
                    iletisim@veraestate.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0 rounded-xl bg-accent/10 p-2.5">
                  <Clock3 className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Çalışma Saatleri</p>
                  <p className="mt-0.5 text-sm text-slate-700">Pzt–Cum: 09:00–19:00</p>
                  <p className="text-sm text-slate-700">Cumartesi: 10:00–16:00</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Sosyal medya */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <p className="mb-4 text-sm font-bold text-foreground">Sosyal Medyada Takip Edin</p>
            <div className="grid grid-cols-2 gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Hızlı arама */}
          <div className="overflow-hidden rounded-2xl bg-primary premium-ring">
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Hemen Arayın</p>
              <p className="mt-2 text-lg font-bold text-white">Uzman Danışman Hattı</p>
              <p className="mt-1.5 text-sm text-slate-400">
                Acil sorular ve randevu talepleriniz için doğrudan arayın.
              </p>
              <a
                href="tel:+902125551234"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold-gradient py-3 text-base font-bold text-slate-900 shadow-lg transition hover:brightness-110"
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
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
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
                  <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="text-sm font-medium text-slate-700 hover:text-accent">
                    {office.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  <a href={`mailto:${office.email}`} className="text-sm font-medium text-slate-700 hover:text-accent">
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
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition hover:border-accent/30"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
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
            İlk görüşme tamamen ücretsiz.
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
