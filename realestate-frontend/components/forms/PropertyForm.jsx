"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, CloudUpload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProperty, uploadPropertyImages } from "@/services/property.service";

const schema = z.object({
  title: z.string().min(3, "Baslik en az 3 karakter olmali"),
  description: z.string().min(10, "Aciklama en az 10 karakter olmali"),
  type: z.enum(["apartment", "house", "land", "commercial"]),
  listingType: z.enum(["sale", "rent"]),
  price: z.coerce.number().nonnegative("Fiyat 0'dan kucuk olamaz"),
  size: z.coerce.number().nonnegative("Metrekare 0'dan kucuk olamaz").optional(),
  rooms: z.coerce.number().int().nonnegative("Oda sayisi gecersiz"),
  bathrooms: z.coerce.number().int().nonnegative("Banyo sayisi gecersiz"),
  city: z.string().min(1, "Sehir zorunlu"),
  district: z.string().min(1, "Ilce zorunlu"),
  address: z.string().min(1, "Adres zorunlu"),
});

export default function PropertyForm() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const steps = useMemo(
    () => [
      {
        key: "basic",
        title: "Temel Bilgiler",
        subtitle: "İlan başlığı, açıklama ve tipi",
        fields: ["title", "description", "type", "listingType"],
      },
      {
        key: "pricing",
        title: "Konum & Fiyat",
        subtitle: "Fiyatlandırma ve adres bilgileri",
        fields: ["price", "size", "city", "district", "address"],
      },
      {
        key: "features",
        title: "Özellikler",
        subtitle: "Oda/banyo ve temel detaylar",
        fields: ["rooms", "bathrooms"],
      },
      {
        key: "images",
        title: "Görsel Yükleme",
        subtitle: "Sürükle-bırak ile yükleyin (opsiyonel)",
        fields: [],
      },
    ],
    []
  );

  const progressValue = useMemo(() => Math.round((step / steps.length) * 100), [step, steps.length]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      type: "apartment",
      listingType: "sale",
      price: "",
      size: "",
      rooms: "",
      bathrooms: "",
      city: "",
      district: "",
      address: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        title: values.title,
        description: values.description,
        type: values.type,
        listingType: values.listingType,
        price: values.price,
        size: values.size || undefined,
        features: {
          rooms: values.rooms,
          bathrooms: values.bathrooms,
        },
        location: {
          city: values.city,
          district: values.district,
          address: values.address,
        },
      };

      const created = await createProperty(payload);
      const propertyId = created?.data?._id;

      if (!propertyId) {
        throw new Error("Ilan olusturulamadi");
      }

      if (files.length > 0) {
        await uploadPropertyImages(propertyId, files);
      }

      return created;
    },
    onSuccess: () => {
      toast.success("Ilan basariyla olusturuldu");
      router.push("/my-listings");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Ilan olusturulurken hata olustu");
    },
  });

  const onSubmit = (values) => {
    submitMutation.mutate(values);
  };

  const previews = useMemo(() => {
    return (files || []).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const goNext = async () => {
    const current = steps[step - 1];
    const ok = current.fields.length ? await form.trigger(current.fields) : true;
    if (!ok) return;
    setStep((s) => Math.min(steps.length, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onDropFiles = (incoming) => {
    if (!incoming?.length) return;
    setFiles((prev) => [...prev, ...incoming]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const incoming = Array.from(e.dataTransfer?.files || []).filter((f) => f.type?.startsWith("image/"));
    onDropFiles(incoming);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Adım {step} / {steps.length}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{steps[step - 1].title}</p>
              <p className="mt-1 text-sm text-slate-600">{steps[step - 1].subtitle}</p>
            </div>
            <div className="w-full md:max-w-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>İlerleme</span>
                <span className="tabular-nums">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="mt-2" />
              <div className="mt-3 grid grid-cols-4 gap-2">
                {steps.map((s, idx) => {
                  const n = idx + 1;
                  const done = n < step;
                  const active = n === step;
                  return (
                    <div
                      key={s.key}
                      className={[
                        "flex items-center gap-2 rounded-xl border px-2 py-2 transition",
                        active ? "border-accent bg-accent/10" : done ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "inline-flex size-6 items-center justify-center rounded-lg text-xs font-semibold",
                          done ? "bg-green-100 text-green-800" : active ? "bg-accent text-primary" : "bg-slate-100 text-slate-700",
                        ].join(" ")}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : n}
                      </span>
                      <span className="hidden text-xs font-medium text-slate-700 md:block">{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            {step === 1 ? (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Başlık</FormLabel>
                      <FormControl>
                        <Input placeholder="Örn: Merkezde modern daire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea rows={6} placeholder="İlan detayları..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emlak Tipi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tip seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Daire</SelectItem>
                          <SelectItem value="house">Ev</SelectItem>
                          <SelectItem value="land">Arsa</SelectItem>
                          <SelectItem value="commercial">Ticari</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="listingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlan Türü</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tür seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">Satılık</SelectItem>
                          <SelectItem value="rent">Kiralık</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiyat (TRY)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metrekare</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şehir</FormLabel>
                      <FormControl>
                        <Input placeholder="İstanbul" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>İlçe</FormLabel>
                      <FormControl>
                        <Input placeholder="Beşiktaş" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input placeholder="Açık adres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            {step === 3 ? (
              <>
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Oda</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banyo</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            {step === 4 ? (
              <div className="md:col-span-2 space-y-4">
                <div
                  className="group relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-accent hover:bg-accent/5"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click?.()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click?.();
                  }}
                >
                  <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:ring-accent/50">
                    <CloudUpload className="h-6 w-6 text-accent" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Görselleri sürükle-bırak</p>
                  <p className="mt-1 text-sm text-slate-600">veya tıklayıp seç. (JPEG/PNG/WebP)</p>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onDropFiles(Array.from(e.target.files || []))}
                  />
                </div>

                {previews.length ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {previews.map((p) => (
                      <div key={p.url} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <Image src={p.url} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Henüz görsel eklemediniz (opsiyonel).</p>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 1 || submitMutation.isPending}>
            Geri
          </Button>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {step < steps.length ? (
              <Button type="button" className="bg-accent text-primary hover:bg-[var(--gold-hover)]" onClick={goNext}>
                İleri
              </Button>
            ) : (
              <Button type="submit" className="bg-accent text-primary hover:bg-[var(--gold-hover)]" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "İlanı Oluştur"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
