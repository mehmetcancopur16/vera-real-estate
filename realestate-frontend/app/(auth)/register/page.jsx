"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";

const schema = z
  .object({
    name: z.string().min(3, "Ad Soyad alanı zorunludur."),
    email: z.string().email("Geçerli bir e-posta girin."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    confirmPassword: z.string().min(6, "Şifre tekrar alanı zorunludur."),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Kullanım şartlarını kabul etmelisiniz." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

const TERMS_SECTIONS = [
  {
    num: "01",
    title: "Hizmet Kapsamı",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    content:
      "Vera Emlak; satılık, kiralık ve yatırım amaçlı gayrimenkul ilanlarını listeleme, danışmanlarla iletişim kurma ve teklif süreçlerini dijital olarak takip etme hizmeti sunar.",
  },
  {
    num: "02",
    title: "Üyelik ve Hesap Güvenliği",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    content:
      "Üyeler, hesap bilgilerini doğru ve güncel tutmakla sorumludur. Şifre güvenliğinin sağlanması kullanıcının sorumluluğundadır; yetkisiz kullanımdan kaynakli durumlarda Vera Emlak gecikmeksizin bilgilendirilmelidir.",
  },
  {
    num: "03",
    title: "İçerik ve İlan Sorumluluğu",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    content:
      "Platforma eklenen ilan, fiyat, görsel ve metin içeriklerinin hukuka uygunluğundan ilan sahibi sorumludur. Yanıltıcı, eksik veya gerçeğe aykırı beyanlar tespit edildiğinde ilanlar kaldırılabilir.",
  },
  {
    num: "04",
    title: "Danışmanlık ve İptal Şartları",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    content:
      "Platform üzerinden başlatılan görüşme ve rezervasyon talepleri, ilgili emlak danışmanı ile mutabakat doğrultusunda sonuçlanır. Planlanan randevuların iptali en geç 24 saat önce bildirilmelidir.",
  },
  {
    num: "05",
    title: "Gizlilik ve Veri İşleme",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    content:
      "Kişisel veriler, yalnızca hizmetin sunulması, güvenliğin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir. Vera Emlak, verileri KVKK kapsamındaki yükümlülüklere uygun şekilde korumayı taahhüt eder.",
  },
  {
    num: "06",
    title: "Sorumluluğun Sınırlandırılması",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    content:
      "Vera Emlak, platformun kesintisiz çalışacağını garanti etmez. Teknik aksaklık, üçüncü taraf hizmet kesintisi veya kullanıcı kaynaklı hatalardan doğan dolaylı zararlardan sorumlu tutulamaz.",
  },
  {
    num: "07",
    title: "Yürürlük",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    content:
      "Bu sözleşme, kullanıcının platforma kayıt olması ile yürürlüğe girer. Vera Emlak, gerekli gördüğü durumlarda metni güncelleyebilir; değişiklikler yayınlandığı tarihten itibaren geçerlidir.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });

  async function onSubmit(values) {
    try {
      const { name, email, password } = values;
      await register({ name, email, password });
      toast.success("Kayıt tamamlandı! Hoş geldiniz.");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kayıt başarısız");
    }
  }

  return (
    <div className="grid w-full min-h-screen grid-cols-1 md:grid-cols-2">
      {/* ── LEFT HERO PANEL ── */}
      <section className="relative hidden md:flex flex-col overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury residence"
          fill
          sizes="50vw"
          className="object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(212,175,55,0.18),transparent_60%)]" />

        {/* Floating decorative orbs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-8 bottom-32 h-48 w-48 rounded-full bg-blue-500/8 blur-2xl animate-float-delayed" />

        {/* Top brand */}
        <div className="relative z-10 p-8">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-amber-500 shadow-lg">
              <Sparkles className="h-4 w-4 text-slate-900" />
            </span>
            <span className="text-xl font-light text-white/90">
              <span className="font-extrabold text-gradient-gold">Vera</span> Real Estate
            </span>
          </div>
        </div>

        {/* Trust badges strip */}
        <div className="relative z-10 mx-8 mt-auto mb-6">
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: ShieldCheck, text: "Güvenli Kayıt" },
              { icon: Star, text: "Premium Üyelik" },
              { icon: Building2, text: "2.400+ İlan" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm"
              >
                <Icon className="h-3 w-3 text-accent" />
                {text}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-md mb-5">
            <span className="size-1.5 animate-pulse rounded-full bg-accent" />
            Vera Signature
          </span>
          <h2 className="text-3xl font-semibold leading-tight text-white mt-4">
            Geleceğinize Değer Katan Güvenli Bir Başlangıç
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/70 leading-relaxed">
            Seçkin portföyümüz ve profesyonel danışmanlıkla, yeni yaşam alanınıza güvenle ulaşmanızı sağlıyoruz.
          </p>

          {/* Feature list */}
          <ul className="mt-6 space-y-2.5">
            {[
              "Binlerce doğrulanmış ilan",
              "7/24 uzman danışman desteği",
              "Güvenli ve şeffaf süreç",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom accent line */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      </section>

      {/* ── RIGHT FORM PANEL ── */}
      <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/6 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-500/5 blur-2xl" />

        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-sm">
            {/* Header */}
            <div className="mb-7">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 shadow-lg">
                <User className="h-5 w-5 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Kayıt Ol</h1>
              <p className="mt-1.5 text-sm text-slate-500">Vera deneyimine katılmak için bilgilerinizi girin.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Ad Soyad</FormLabel>
                      <FormControl>
                        <div className="group relative input-focus-glow">
                          <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            className="h-11 border-slate-200 bg-slate-50/80 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/60 focus-visible:bg-white focus-visible:ring-accent/20 transition-all"
                            placeholder="Adınız Soyadınız"
                            {...field}
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
                      <FormLabel className="text-sm font-semibold text-slate-700">E-posta</FormLabel>
                      <FormControl>
                        <div className="group relative input-focus-glow">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            type="email"
                            className="h-11 border-slate-200 bg-slate-50/80 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/60 focus-visible:bg-white focus-visible:ring-accent/20 transition-all"
                            placeholder="ornek@vera.com"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Şifre</FormLabel>
                      <FormControl>
                        <div className="group relative input-focus-glow">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-11 border-slate-200 bg-slate-50/80 pl-10 pr-11 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/60 focus-visible:bg-white focus-visible:ring-accent/20 transition-all"
                            placeholder="En az 6 karakter"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-700"
                          >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">Şifre Tekrar</FormLabel>
                      <FormControl>
                        <div className="group relative input-focus-glow">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="h-11 border-slate-200 bg-slate-50/80 pl-10 pr-11 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent/60 focus-visible:bg-white focus-visible:ring-accent/20 transition-all"
                            placeholder="Şifrenizi tekrar girin"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((p) => !p)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-700"
                          >
                            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Terms */}
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                            className="mt-0.5 border-slate-300 data-[state=checked]:border-accent data-[state=checked]:bg-accent"
                          />
                        </FormControl>
                        <Label className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                          <Dialog>
                            <DialogTrigger className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent/80 underline underline-offset-2 transition-colors cursor-pointer">
                              <FileText className="h-3.5 w-3.5" />
                              Kullanım Şartları ve Gizlilik Politikası
                            </DialogTrigger>

                            {/* ── PREMIUM TERMS MODAL ── */}
                            <DialogContent className="flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-3xl border-0 p-0 shadow-2xl sm:max-w-2xl">
                              {/* Modal header */}
                              <div className="flex-shrink-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-5">
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 ring-1 ring-accent/30">
                                    <ShieldCheck className="h-5 w-5 text-accent" />
                                  </span>
                                  <div>
                                    <DialogTitle className="text-lg font-bold text-white">
                                      Vera Emlak Kullanım Sözleşmesi
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-400 mt-0.5">
                                      Lütfen kayıt işlemini tamamlamadan önce bu metni dikkatlice inceleyiniz.
                                    </DialogDescription>
                                  </div>
                                </div>
                              </div>

                              {/* Scrollable sections */}
                              <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-5">
                                <div className="space-y-3">
                                  {TERMS_SECTIONS.map((section) => (
                                    <div
                                      key={section.num}
                                      className={`flex gap-4 rounded-2xl border ${section.border} bg-white p-4 shadow-sm transition hover:shadow-md`}
                                    >
                                      <span
                                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${section.bg} text-sm font-black ${section.color}`}
                                      >
                                        {section.num}
                                      </span>
                                      <div>
                                        <h3 className={`text-sm font-bold ${section.color}`}>
                                          {section.title}
                                        </h3>
                                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                                          {section.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Modal footer */}
                              <DialogFooter className="flex-shrink-0 border-t border-slate-200 bg-white px-6 py-4">
                                <div className="flex w-full items-center justify-between gap-3">
                                  <p className="text-xs text-slate-400">Son güncelleme: Mart 2026</p>
                                  <div className="flex items-center gap-2">
                                    <DialogClose asChild>
                                      <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                                        Kapat
                                      </button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <button
                                        onClick={() => field.onChange(true)}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:brightness-95"
                                      >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Kabul Ediyorum
                                      </button>
                                    </DialogClose>
                                  </div>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <span className="ml-1">metnini okudum, kabul ediyorum.</span>
                        </Label>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  className="mt-1 w-full h-12 gap-2 rounded-xl bg-gold-gradient text-primary font-bold shadow-md shadow-amber-200/40 transition-all hover:brightness-95 hover:shadow-lg active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Kayıt oluşturuluyor...
                    </>
                  ) : (
                    <>
                      Kayıt Ol
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">veya</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <p className="mt-4 text-center text-sm text-slate-500">
              Zaten hesabın var mı?{" "}
              <Link href="/login" className="font-semibold text-accent transition hover:text-accent/80 hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </div>

          {/* Trust row below card */}
          <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              SSL Güvenli
            </span>
            <span className="h-3 w-px bg-slate-300" />
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-blue-500" />
              Şifrelenmiş
            </span>
            <span className="h-3 w-px bg-slate-300" />
            <span className="inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              KVKK Uyumlu
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
