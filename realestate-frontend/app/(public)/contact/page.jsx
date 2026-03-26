"use client";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createContactMessage } from "@/services/contact.service";

const schema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmali."),
  email: z.string().trim().email("Gecerli bir e-posta girin."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmali."),
});

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values) {
    try {
      await createContactMessage(values);
      toast.success("Mesajiniz basariyla iletildi, ekibimiz size donus yapacaktir.");
      form.reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Mesaj gonderilirken bir hata olustu.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-border/80 premium-ring">
        <div className="relative h-[280px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop"
            alt="Vera Merkez Ofis"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-black/35" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="mb-3 inline-flex w-fit rounded-full border border-accent/50 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent backdrop-blur">
              Vera Real Estate
            </span>
            <h1 className="text-4xl font-semibold">Bize Ulasin</h1>
            <p className="mt-2 max-w-xl text-sm text-white/85">
              Yeni bir yasam alani, yatirim firsati veya portfoy yonetimi hakkinda uzman ekibimizle
              hemen iletisime gecin.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-semibold text-slate-900">Vera Merkez Ofis</h2>
          <p className="mt-2 text-sm text-slate-600">
            Premium emlak danismanligi, yatirim yonetimi ve ozel portfoy hizmetlerimiz icin size bir
            telefon kadar yakiniz.
          </p>
          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-slate-100 p-3 text-accent">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Adres</p>
                <p className="text-sm text-slate-600">Bagdat Caddesi No:125, Kadikoy / Istanbul</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-slate-100 p-3 text-accent">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Telefon</p>
                <p className="text-sm text-slate-600">+90 (216) 555 12 34</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-slate-100 p-3 text-accent">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">E-posta</p>
                <p className="text-sm text-slate-600">iletisim@veraestate.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-semibold text-slate-900">Mesaj Birakin</h2>
          <p className="mt-2 text-sm text-slate-600">
            Talebinizi bize iletin, uzman ekibimiz en kisa surede sizinle iletisime gececektir.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Soyad</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-accent" placeholder="Adiniz Soyadiniz" />
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
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="focus-visible:ring-accent" placeholder="ornek@vera.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon (Opsiyonel)</FormLabel>
                    <FormControl>
                      <Input {...field} className="focus-visible:ring-accent" placeholder="+90 5xx xxx xx xx" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesaj</FormLabel>
                    <FormControl>
                      <Textarea rows={6} {...field} className="focus-visible:ring-accent" placeholder="Size nasil yardimci olabiliriz?" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-gradient text-primary hover:brightness-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gonderiliyor...
                  </>
                ) : (
                  "Mesaj Gonder"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
