"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", message: "" },
  });

  function onSubmit(values) {
    console.log(values);
    toast.success("Mesajiniz alindi");
    form.reset();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-xl border bg-card p-6">
        <h1 className="text-3xl font-semibold">Iletisim</h1>
        <p className="mt-3 text-sm text-muted-foreground">Adres, telefon ve e-posta bilgileri.</p>
      </section>
      <section className="rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>Ad</FormLabel><FormControl><Input {...field} className="focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Soyad</FormLabel><FormControl><Input {...field} className="focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>E-posta</FormLabel><FormControl><Input type="email" {...field} className="focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="message" render={({ field }) => (
              <FormItem><FormLabel>Mesaj</FormLabel><FormControl><Textarea rows={6} {...field} className="focus-visible:ring-accent" /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="bg-accent text-primary hover:bg-[var(--gold-hover)]">Gonder</Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
