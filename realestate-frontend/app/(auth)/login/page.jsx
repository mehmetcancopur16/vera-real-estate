"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuthStore } from "@/store/useAuthStore";

const schema = z.object({
  email: z.string().email("Gecerli e-posta girin"),
  password: z.string().min(6, "Sifre en az 6 karakter"),
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

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
        <div className="absolute inset-0 bg-primary/65" />
      </section>
      <section className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-semibold">Giris Yap</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hesabiniza giris yaparak devam edin.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl><Input type="email" className="focus-visible:ring-accent" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sifre</FormLabel>
                  <FormControl><Input type="password" className="focus-visible:ring-accent" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-accent text-primary hover:bg-[var(--gold-hover)]" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Giris yapiliyor...</> : "Giris Yap"}
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
