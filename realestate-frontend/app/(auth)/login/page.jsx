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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury residence"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-transparent" />
        <div className="absolute inset-x-10 bottom-14 animate-in fade-in duration-700">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Vera Real Estate</p>
          <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight text-white">
            Her Anahtar, Ozel Bir Yasama Acilir
          </h2>
          <p className="mt-3 text-sm text-white/80">Guvenilir yatirim, secici portfoy ve premium deneyim.</p>
        </div>
      </section>
      <section className="flex flex-col justify-center bg-slate-50 px-6 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-white p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-semibold text-primary">Giris Yap</h1>
          <p className="mt-1 text-sm text-muted-foreground">Premium panelinize erisin ve ilanlarinizi yonetin.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
                        <Input
                          type="email"
                          placeholder="ornek@vera.com"
                          className="h-11 pl-10 focus-visible:ring-accent"
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
                    <FormLabel>Sifre</FormLabel>
                    <FormControl>
                      <div className="group relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          className="h-11 pl-10 pr-10 focus-visible:ring-accent"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-accent"
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
                      <Label className="text-sm text-muted-foreground">Beni Hatirla</Label>
                    </FormItem>
                  )}
                />
                <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-accent">
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
          <p className="mt-4 text-sm text-muted-foreground">
            Hesabin yok mu? <Link href="/register" className="text-accent hover:underline">Kayit ol</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
