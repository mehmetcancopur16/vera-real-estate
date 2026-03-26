"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
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
    name: z.string().min(3, "Ad Soyad alani zorunludur."),
    email: z.string().email("Gecerli bir e-posta girin."),
    password: z.string().min(6, "Sifre en az 6 karakter olmalidir."),
    confirmPassword: z.string().min(6, "Sifre tekrar alani zorunludur."),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "Kullanim sartlarini kabul etmelisiniz." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Sifreler eslesmiyor",
    path: ["confirmPassword"],
  });

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
      toast.success("Kayit tamamlandi");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kayit basarisiz");
    }
  }

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2">
      <section className="relative hidden md:flex">
        <Image
          src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury residence"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-primary/65 to-black/70" />
        <div className="absolute inset-x-10 bottom-14 space-y-4 animate-in fade-in duration-700">
          <span className="inline-flex rounded-full border border-accent/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent backdrop-blur">
            Vera Signature
          </span>
          <p className="text-sm uppercase tracking-[0.24em] text-accent">Vera Real Estate</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-white">
            Geleceginize Deger Katan Guvenli Bir Baslangic
          </h2>
          <p className="max-w-sm text-sm text-white/80">
            Seckin portfoyumuz ve profesyonel danismanlikla, yeni yasam alaniniza guvenle
            ulasmanizi sagliyoruz.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-surface p-6">
        <div className="panel-surface w-full max-w-md animate-in fade-in slide-in-from-bottom-4 rounded-2xl p-8 shadow-2xl duration-700">
          <h1 className="text-3xl font-semibold text-slate-900">Kayit Ol</h1>
          <p className="mt-1 text-sm text-slate-500">Vera deneyimine katilmak icin bilgilerinizi girin.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Ad Soyad</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                        <Input
                          className="h-11 border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-accent"
                          placeholder="Ad Soyad"
                          {...field}
                        />
                      </div>
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
                      <div className="group relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                        <Input
                          type="email"
                          className="h-11 border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-accent"
                          placeholder="ornek@vera.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Sifre</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="h-11 border-slate-200 bg-slate-50 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-accent"
                          placeholder="******"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                          aria-label={showPassword ? "Sifreyi gizle" : "Sifreyi goster"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-slate-700">Sifre Tekrar</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          className="h-11 border-slate-200 bg-slate-50 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-accent"
                          placeholder="******"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                          aria-label={showConfirmPassword ? "Sifre tekrarini gizle" : "Sifre tekrarini goster"}
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-start gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <Label className="text-sm text-slate-600">
                        <Dialog>
                          <DialogTrigger className="text-accent hover:underline cursor-pointer">
                            Kullanim Sartlari ve Gizlilik Politikasi
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Vera Emlak Kullanim Sozlesmesi</DialogTitle>
                              <DialogDescription>
                                Lutfen kayit islemini tamamlamadan once bu metni dikkatlice inceleyiniz.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2 text-sm text-slate-600">
                              <p>
                                Bu sozlesme, Vera Real Estate platformunu kullanan tum uye ve ziyaretciler icin
                                gecerlidir. Platforma kayit oldugunuz andan itibaren bu metinde yer alan tum
                                sartlari kabul etmis sayilirsiniz.
                              </p>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">1. Hizmet Kapsami</h3>
                                <p>
                                  Vera Emlak; satilik, kiralik ve yatirim amacli gayrimenkul ilanlarini
                                  listeleme, danismanlarla iletisim kurma ve teklif sureclerini dijital olarak
                                  takip etme hizmeti sunar.
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">2. Uyelik ve Hesap Guvenligi</h3>
                                <p>
                                  Uyeler, hesap bilgilerini dogru ve guncel tutmakla sorumludur. Sifre
                                  guvenliginin saglanmasi kullanicinin sorumlulugundadir; yetkisiz kullanimdan
                                  kaynakli durumlarda Vera Emlak gecikmeksizin bilgilendirilmelidir.
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">3. Icerik ve Ilan Sorumlulugu</h3>
                                <p>
                                  Platforma eklenen ilan, fiyat, gorsel ve metin iceriklerinin hukuka uygunlugundan
                                  ilan sahibi sorumludur. Yaniltici, eksik veya gercege aykiri beyanlar tespit
                                  edildiginde ilanlar kaldirilabilir.
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">4. Danismanlik ve Iptal Sartlari</h3>
                                <p>
                                  Platform uzerinden baslatilan gorusme ve rezervasyon talepleri, ilgili emlak
                                  danismani ile mutabakat dogrultusunda sonuclanir. Planlanan randevularin iptali
                                  en gec 24 saat once bildirilmelidir. Gec bildirimlerde operasyonel masraflar
                                  yansitilabilir.
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">5. Gizlilik ve Veri Isleme</h3>
                                <p>
                                  Kisisel veriler, yalnizca hizmetin sunulmasi, guvenligin saglanmasi ve yasal
                                  yukumluluklerin yerine getirilmesi amaciyla islenir. Vera Emlak, verileri KVKK
                                  kapsamindaki yukumluluklere uygun sekilde korumayi taahhut eder.
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">6. Sorumlulugun Sinirlandirilmasi</h3>
                                <p>
                                  Vera Emlak, platformun kesintisiz calisacagini garanti etmez. Teknik aksaklik,
                                  ucuncu taraf hizmet kesintisi veya kullanici kaynakli hatalardan dogan dolayli
                                  zararlardan sorumlu tutulamaz.
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h3 className="font-semibold text-slate-900">7. Yururluk</h3>
                                <p>
                                  Bu sozlesme, kullanicinin platforma kayit olmasi ile yururluge girer. Vera Emlak,
                                  gerekli gordugu durumlarda metni guncelleyebilir; degisiklikler yayinlandigi
                                  tarihten itibaren gecerlidir.
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                                Kapat
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <span> metnini okudum, kabul ediyorum.</span>
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full gap-2 bg-gold-gradient text-primary shadow-md transition-all hover:brightness-95 hover:shadow-lg active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Kayit olusturuluyor...
                  </>
                ) : (
                  "Kayit Ol"
                )}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-sm text-slate-500">
            Zaten hesabin var mi?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Giris Yapin
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
