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
  name: z.string().min(2, "Ad gerekli"),
  email: z.string().email("Gecerli e-posta girin"),
  password: z.string().min(6, "Sifre en az 6 karakter"),
});

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "" } });

  async function onSubmit(values) {
    try {
      await register(values);
      toast.success("Kayit tamamlandi");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Kayit basarisiz");
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury residence"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/65" />
      </section>
      <section className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl font-semibold">Kayit Ol</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hesabinizi olusturun.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl><Input className="focus-visible:ring-accent" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kayit olusturuluyor...</> : "Kayit Ol"}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-sm text-muted-foreground">
            Hesabin var mi? <Link href="/login" className="text-accent hover:underline">Giris yap</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
