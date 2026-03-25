"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuthStore } from "@/store/useAuthStore";

const schema = z.object({
  email: z.string().email("Gecerli e-posta girin"),
  password: z.string().min(6, "Sifre en az 6 karakter"),
  rememberMe: z.boolean().default(false),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values) {
    try {
      await login(values);
      toast.success("Hos geldiniz");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Giris basarisiz");
    }
  }

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-2">
      <section className="relative hidden md:flex">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury residence"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-primary/65 to-black/70" />
        <div className="absolute inset-x-10 bottom-14 space-y-4 animate-in fade-in duration-700">
          <span className="inline-flex rounded-full border border-accent/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent backdrop-blur">
            Premium Access
          </span>
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Vera Real Estate</p>
          <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight text-white">
            Her Anahtar, Ozel Bir Yasama Acilir
          </h2>
          <p className="max-w-sm text-sm text-white/80">
            Guvenilir yatirim, secici portfoy ve lüks deneyimle emlak yolculugunuzu yonetin.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl duration-700">
          <h1 className="text-3xl font-semibold text-slate-900">Giris Yap</h1>
          <p className="mt-1 text-sm text-slate-500">Hesabiniza erismek icin bilgilerinizi girin.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
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
                          placeholder="ornek@vera.com"
                          className="h-11 border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-accent"
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
                          placeholder="******"
                          className="h-11 border-slate-200 bg-slate-50 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-accent"
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
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                      </FormControl>
                      <Label className="text-sm text-slate-600">Beni Hatirla</Label>
                    </FormItem>
                  )}
                />
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-accent">
                  Sifremi Unuttum?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full gap-2 bg-accent text-primary shadow-md transition-all hover:bg-[var(--gold-hover)] hover:shadow-lg active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Giris yapiliyor...
                  </>
                ) : (
                  "Giris Yap"
                )}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-sm text-slate-600">
            Hesabin yok mu? <Link href="/register" className="text-accent hover:underline">Kayit ol</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
