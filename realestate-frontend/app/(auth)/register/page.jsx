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
          src="https://images.unsplash.com/photo-1613977257592-487ecd136cc3?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury residence"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-10 bottom-14 animate-in fade-in duration-700">
          <p className="text-sm uppercase tracking-[0.24em] text-accent">Vera Real Estate</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-white">
            Geleceginize Deger Katan Guvenli Bir Baslangic
          </h2>
          <p className="mt-3 text-sm text-white/80">Seckin portfoyumuz ve profesyonel danismanlikla yaninizdayiz.</p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl duration-700">
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
                        Kullanim sartlarini ve Gizlilik politikasini okudum, kabul ediyorum.
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full gap-2 bg-accent text-primary shadow-md transition-all hover:bg-[var(--gold-hover)] hover:shadow-lg active:scale-95"
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
