"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Bath,
  BedDouble,
  Building2,
  Car,
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  Flame,
  Layers,
  Loader2,
  MapPin,
  Maximize2,
  Sofa,
  Video,
  X,
} from "lucide-react";
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
import { createProperty, updateProperty, uploadPropertyImages } from "@/services/property.service";

/* ── constants ── */
const TR_CITIES = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
  "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep",
  "Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir",
  "Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale",
  "Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa",
  "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize",
  "Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ",
  "Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];

const AMENITY_OPTIONS = [
  "Balkon","Teras","Bahçe","Asansör","Otopark","Kapalı Otopark",
  "Güvenlik / Güvenlikli Site","Havuz","Yüzme Havuzu","Spor Salonu / Fitness",
  "Sauna","Jeneratör","Depreme Dayanıklı","Isı Yalıtımı","Ses Yalıtımı",
  "Güneş Enerjisi","Doğalgaz","Merkezi Isıtma","Klima","Akıllı Ev Sistemi",
  "Çelik Kapı","PVC Doğrama","Parke","Laminat","Seramik",
  "Açık Mutfak","Ada Mutfak","Ankastre Mutfak","Banyo","Ebeveyn Banyosu",
];

const DEED_STATUS_OPTIONS = [
  "Kat Mülkiyeti","Kat İrtifakı","Arsa Tapusu","Hisseli Tapu","Müstakil Tapu",
];

const HEATING_OPTIONS = [
  { value: "kombi", label: "Doğalgaz Kombisi" },
  { value: "merkezi", label: "Merkezi Isıtma" },
  { value: "yerden", label: "Yerden Isıtma" },
  { value: "elektrik", label: "Elektrikli Isıtma" },
  { value: "klima", label: "Klima" },
  { value: "soba", label: "Soba / Şömine" },
  { value: "yok", label: "Isıtma Yok" },
];

const STEPS = [
  { key: "basic",    title: "Temel Bilgiler",   subtitle: "Başlık, açıklama ve ilan tipi",       fields: ["title", "description", "type", "listingType"] },
  { key: "location", title: "Konum & Fiyat",    subtitle: "Adres ve fiyatlandırma bilgileri",     fields: ["city", "district", "address", "price", "size"] },
  { key: "features", title: "Özellikler",       subtitle: "Oda, kat, yıl ve teknik detaylar",     fields: ["rooms", "bathrooms"] },
  { key: "images",   title: "Görsel Yükleme",   subtitle: "Sürükle-bırak ile yükleyin",           fields: [] },
];

/* ── zod schema ── */
const schema = z.object({
  title:          z.string().trim().min(3, "Başlık en az 3 karakter olmalı"),
  description:    z.string().trim().min(10, "Açıklama en az 10 karakter olmalı"),
  type:           z.enum(["apartment", "house", "land", "commercial"]),
  listingType:    z.enum(["sale", "rent"]),
  price:          z.coerce.number().nonnegative("Fiyat 0'dan küçük olamaz"),
  size:           z.coerce.number().nonnegative().optional().or(z.literal("")),
  city:           z.string().trim().min(1, "Şehir zorunlu"),
  district:       z.string().trim().min(1, "İlçe zorunlu"),
  address:        z.string().trim().min(1, "Adres zorunlu"),
  rooms:          z.coerce.number().int().nonnegative("Geçersiz oda sayısı"),
  bathrooms:      z.coerce.number().int().nonnegative("Geçersiz banyo sayısı"),
  floor:          z.coerce.number().int().optional().or(z.literal("")),
  totalFloors:    z.coerce.number().int().nonnegative().optional().or(z.literal("")),
  heating:        z.string().optional(),
  yearBuilt:      z.coerce.number().int().min(1800).max(new Date().getFullYear() + 5).optional().or(z.literal("")),
  status:         z.enum(["ready", "under-construction"]).default("ready"),
  deedStatus:     z.string().optional(),
  maintenanceFee: z.coerce.number().nonnegative().optional().or(z.literal("")),
  parking:        z.boolean().default(false),
  furnished:      z.boolean().default(false),
  virtualTourUrl: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  amenities:      z.array(z.string()).default([]),
});

/* ── city combobox ── */
function normalize(str) {
  return str.toLocaleLowerCase("tr-TR")
    .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
    .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c");
}

function CityCombobox({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return TR_CITIES;
    const q = normalize(search.trim());
    return TR_CITIES.filter((c) => normalize(c).includes(q));
  }, [search]);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 40); }}
        className={`flex h-10 w-full items-center gap-2 rounded-xl border bg-background px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
          error ? "border-destructive" : "border-input"
        }`}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
        <span className={`flex-1 truncate ${value ? "text-foreground" : "text-muted-foreground"}`}>
          {value || "Şehir seçin"}
        </span>
        {value
          ? <X className="h-3 w-3 shrink-0 text-slate-400" onClick={(e) => { e.stopPropagation(); onChange(""); }} />
          : <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
        }
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <input ref={inputRef} value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Şehir ara..." className="w-full rounded-lg bg-slate-50 px-3 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:bg-slate-100" />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0
              ? <li className="px-3 py-2 text-xs text-slate-400">Sonuç bulunamadı</li>
              : filtered.map((city) => (
                <li key={city}>
                  <button type="button" onClick={() => { onChange(city); setOpen(false); setSearch(""); }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent/10 hover:text-accent ${
                      value === city ? "bg-accent/10 font-semibold text-accent" : "text-slate-800"
                    }`}>{city}</button>
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── toggle ── */
function BoolToggle({ checked, onChange, labelOn, labelOff }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        checked
          ? "border-accent bg-accent/10 text-accent"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
      }`}
    >
      <span>{checked ? labelOn : labelOff}</span>
      <span className={`h-5 w-9 rounded-full transition-colors ${checked ? "bg-accent" : "bg-slate-300"}`}>
        <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

/* ── main form ── */
const MAX_IMAGES = 12;

export default function PropertyForm({ propertyId = null, defaultValues: initialData = null }) {
  const router = useRouter();
  const isEditMode = Boolean(propertyId);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);

  const progressValue = useMemo(() => Math.round((step / STEPS.length) * 100), [step]);

  const buildDefaults = (data) => ({
    title:          data?.title || "",
    description:    data?.description || "",
    type:           data?.type || "apartment",
    listingType:    data?.listingType || "sale",
    price:          data?.price ?? "",
    size:           data?.size ?? "",
    city:           data?.location?.city || "",
    district:       data?.location?.district || "",
    address:        data?.location?.address || "",
    rooms:          data?.features?.rooms ?? "",
    bathrooms:      data?.features?.bathrooms ?? "",
    floor:          data?.features?.floor ?? "",
    totalFloors:    data?.totalFloors ?? "",
    heating:        data?.features?.heating || "",
    yearBuilt:      data?.yearBuilt ?? "",
    status:         data?.status || "ready",
    deedStatus:     data?.deedStatus || "",
    maintenanceFee: data?.maintenanceFee ?? "",
    parking:        Boolean(data?.parking),
    furnished:      Boolean(data?.furnished),
    virtualTourUrl: data?.virtualTourUrl || "",
    amenities:      data?.amenities || [],
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(initialData),
  });

  /* Sync form when initialData arrives asynchronously */
  useEffect(() => {
    if (initialData) {
      form.reset(buildDefaults(initialData));
    }
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const features = {
        rooms:     values.rooms !== "" ? Number(values.rooms) : undefined,
        bathrooms: values.bathrooms !== "" ? Number(values.bathrooms) : undefined,
        floor:     values.floor !== "" ? Number(values.floor) : undefined,
        heating:   values.heating || undefined,
      };

      const payload = {
        title:          values.title,
        description:    values.description,
        type:           values.type,
        listingType:    values.listingType,
        price:          Number(values.price),
        size:           values.size !== "" ? Number(values.size) : undefined,
        yearBuilt:      values.yearBuilt !== "" ? Number(values.yearBuilt) : undefined,
        status:         values.status,
        deedStatus:     values.deedStatus || undefined,
        maintenanceFee: values.maintenanceFee !== "" ? Number(values.maintenanceFee) : undefined,
        totalFloors:    values.totalFloors !== "" ? Number(values.totalFloors) : undefined,
        parking:        Boolean(values.parking),
        furnished:      Boolean(values.furnished),
        virtualTourUrl: values.virtualTourUrl || undefined,
        amenities:      values.amenities,
        features,
        location: {
          city:     values.city,
          district: values.district,
          address:  values.address,
        },
      };

      if (isEditMode) {
        const updated = await updateProperty(propertyId, payload);
        if (files.length > 0) {
          try {
            await uploadPropertyImages(propertyId, files);
          } catch {
            toast.warning("İlan güncellendi fakat görseller yüklenemedi. Daha sonra tekrar deneyebilirsiniz.");
          }
        }
        return updated;
      } else {
        const created = await createProperty(payload);
        const newId = created?.data?._id;
        if (!newId) throw new Error("İlan oluşturulamadı");
        if (files.length > 0) {
          try {
            await uploadPropertyImages(newId, files);
          } catch {
            toast.warning("İlan oluşturuldu fakat görseller yüklenemedi. İlanlarım sayfasından ekleyebilirsiniz.");
          }
        }
        return created;
      }
    },
    onSuccess: () => {
      if (isEditMode) {
        toast.success("İlan başarıyla güncellendi!");
      } else {
        toast.success("İlan başarıyla oluşturuldu!");
      }
      router.push("/my-listings");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        (isEditMode ? "İlan güncellenirken hata oluştu." : "İlan oluşturulurken hata oluştu.")
      );
    },
  });

  const previews = useMemo(() => (files || []).map((f) => ({ name: f.name, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const goNext = async () => {
    const current = STEPS[step - 1];
    const ok = current.fields.length ? await form.trigger(current.fields) : true;
    if (!ok) return;
    setStep((s) => Math.min(STEPS.length, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const onDrop = (e) => {
    e.preventDefault();
    const incoming = Array.from(e.dataTransfer?.files || []).filter((f) => f.type?.startsWith("image/"));
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_IMAGES));
  };

  const currentAmens = form.watch("amenities");
  const toggleAmenity = (val) => {
    const current = form.getValues("amenities");
    form.setValue("amenities", current.includes(val) ? current.filter((a) => a !== val) : [...current, val]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => submitMutation.mutate(v))} className="space-y-6">

        {/* ── Step indicator ── */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                Adım {step} / {STEPS.length}
              </p>
              <p className="mt-1.5 text-xl font-bold text-foreground">{STEPS[step - 1].title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{STEPS[step - 1].subtitle}</p>
            </div>
            <div className="w-full md:max-w-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>İlerleme</span>
                <span className="font-semibold text-accent">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {STEPS.map((s, idx) => {
                  const n = idx + 1;
                  const done = n < step;
                  const active = n === step;
                  return (
                    <div key={s.key} className={`rounded-xl border p-2 text-center transition ${
                      active ? "border-accent bg-accent/10" : done ? "border-green-200 bg-green-50" : "border-border/60 bg-background"
                    }`}>
                      <div className={`mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                        done ? "bg-green-100 text-green-700" : active ? "bg-accent text-slate-900" : "bg-slate-100 text-slate-500"
                      }`}>
                        {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
                      </div>
                      <p className="text-[10px] font-semibold leading-tight text-slate-600">{s.title.split(" ")[0]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Step content ── */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">

            {/* STEP 1: Temel Bilgiler */}
            {step === 1 && <>
              <FormField control={form.control} name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-semibold">İlan Başlığı</FormLabel>
                    <FormControl><Input placeholder="Örn: Kadıköy'de deniz manzaralı 3+1 daire" {...field} className="h-11 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-semibold">Açıklama</FormLabel>
                    <FormControl><Textarea rows={5} placeholder="Mülkünüzü detaylı şekilde tanıtın. Konum avantajları, özel özellikler, ulaşım imkânları..." {...field} className="resize-none border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Emlak Tipi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-slate-300 focus:ring-accent/60">
                          <SelectValue placeholder="Tip seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">🏢 Daire</SelectItem>
                        <SelectItem value="house">🏠 Villa / Ev</SelectItem>
                        <SelectItem value="land">🌳 Arsa</SelectItem>
                        <SelectItem value="commercial">🏪 Ticari</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="listingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">İlan Türü</FormLabel>
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                      {[{ v: "sale", l: "🏷 Satılık" }, { v: "rent", l: "🔑 Kiralık" }].map(({ v, l }) => (
                        <button key={v} type="button" onClick={() => field.onChange(v)}
                          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                            field.value === v ? "bg-white text-foreground shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}>{l}</button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>}

            {/* STEP 2: Konum & Fiyat */}
            {step === 2 && <>
              <FormField control={form.control} name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Şehir</FormLabel>
                    <FormControl>
                      <CityCombobox value={field.value} onChange={field.onChange} error={!!form.formState.errors.city} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">İlçe / Semt</FormLabel>
                    <FormControl><Input placeholder="Örn: Beşiktaş" {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="font-semibold">Açık Adres</FormLabel>
                    <FormControl><Input placeholder="Mahalle, cadde/sokak, kapı no..." {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Fiyat (₺)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₺</span>
                        <Input type="number" min={0} placeholder="0" {...field} className="h-10 border-slate-300 pl-7 focus-visible:ring-accent/60" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Alan (m²)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="number" min={0} placeholder="0" {...field} className="h-10 border-slate-300 pr-10 focus-visible:ring-accent/60" />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">m²</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>}

            {/* STEP 3: Özellikler */}
            {step === 3 && <>
              {/* rooms / bathrooms */}
              <FormField control={form.control} name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><BedDouble className="h-4 w-4 text-accent" /> Oda Sayısı</FormLabel>
                    <FormControl><Input type="number" min={0} placeholder="3" {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><Bath className="h-4 w-4 text-accent" /> Banyo Sayısı</FormLabel>
                    <FormControl><Input type="number" min={0} placeholder="1" {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* floor / totalFloors */}
              <FormField control={form.control} name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><Building2 className="h-4 w-4 text-accent" /> Bulunduğu Kat</FormLabel>
                    <FormControl><Input type="number" placeholder="Örn: 3" {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="totalFloors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><Layers className="h-4 w-4 text-accent" /> Toplam Kat</FormLabel>
                    <FormControl><Input type="number" min={1} placeholder="Örn: 8" {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* yearBuilt / heating */}
              <FormField control={form.control} name="yearBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Yapı Yılı</FormLabel>
                    <FormControl><Input type="number" min={1800} max={2030} placeholder="Örn: 2015" {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="heating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><Flame className="h-4 w-4 text-accent" /> Isıtma Tipi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 border-slate-300 focus:ring-accent/60">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HEATING_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* status / deedStatus */}
              <FormField control={form.control} name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Yapı Durumu</FormLabel>
                    <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                      {[{ v: "ready", l: "Oturuma Hazır" }, { v: "under-construction", l: "İnşaat Aşamasında" }].map(({ v, l }) => (
                        <button key={v} type="button" onClick={() => field.onChange(v)}
                          className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition ${
                            field.value === v ? "bg-white text-foreground shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}>{l}</button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="deedStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Tapu Durumu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 border-slate-300 focus:ring-accent/60">
                          <SelectValue placeholder="Tapu türü seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEED_STATUS_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* maintenanceFee / virtualTourUrl */}
              <FormField control={form.control} name="maintenanceFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Aidat (₺/ay)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₺</span>
                        <Input type="number" min={0} placeholder="0" {...field} className="h-10 border-slate-300 pl-7 focus-visible:ring-accent/60" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="virtualTourUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold">
                      <Video className="h-4 w-4 text-accent" /> Sanal Tur URL
                      <span className="font-normal text-slate-400">(opsiyonel)</span>
                    </FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} className="h-10 border-slate-300 focus-visible:ring-accent/60" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* parking / furnished */}
              <FormField control={form.control} name="parking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><Car className="h-4 w-4 text-accent" /> Otopark</FormLabel>
                    <FormControl>
                      <BoolToggle checked={field.value} onChange={field.onChange} labelOn="Otopark Mevcut" labelOff="Otopark Yok" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="furnished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex items-center gap-1.5 font-semibold"><Sofa className="h-4 w-4 text-accent" /> Eşyalı</FormLabel>
                    <FormControl>
                      <BoolToggle checked={field.value} onChange={field.onChange} labelOn="Eşyalı" labelOff="Eşyasız" />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Amenities */}
              <div className="md:col-span-2 space-y-3">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-accent" />
                  Olanaklar <span className="font-normal text-slate-400">(seçin)</span>
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const selected = currentAmens?.includes(amenity);
                    return (
                      <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          selected
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-accent/40"
                        }`}
                      >
                        {selected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>}

            {/* STEP 4: Görsel Yükleme */}
            {step === 4 && (
              <div className="md:col-span-2 space-y-5">
                <div
                  className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-accent hover:bg-accent/5"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDrop}
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:ring-accent/50">
                    <CloudUpload className="h-7 w-7 text-accent" />
                  </div>
                  <p className="mt-4 text-base font-bold text-foreground">Görselleri buraya sürükleyin</p>
                  <p className="mt-1 text-sm text-slate-500">veya tıklayarak seçin · JPEG, PNG, WebP</p>
                  <p className="mt-2 text-xs text-slate-400">
                    En fazla <strong>{MAX_IMAGES}</strong> görsel ·{" "}
                    <strong className="text-accent">{files.length}</strong> görsel seçili
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const incoming = Array.from(e.target.files || []);
                      setFiles((prev) => [...prev, ...incoming].slice(0, MAX_IMAGES));
                    }}
                  />
                </div>

                {previews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Önizleme ({previews.length})</p>
                      <button type="button" onClick={() => setFiles([])}
                        className="text-xs font-semibold text-red-500 transition hover:text-red-600">
                        Tümünü Kaldır
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                      {previews.map((p, idx) => (
                        <div key={p.url} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                          <Image src={p.url} alt={p.name} fill sizes="25vw" className="object-cover transition group-hover:scale-105" />
                          {idx === 0 && (
                            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-slate-900">Kapak</span>
                          )}
                          <button type="button" onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 opacity-0 shadow transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
                    Görsel eklenmedi. Görseller opsiyoneldir — dilerseniz atlayabilirsiniz.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={step === 1 || submitMutation.isPending}
            className="border-slate-300 font-semibold"
          >
            ← Geri
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={goNext}
              className="bg-gold-gradient font-bold text-slate-900 shadow hover:brightness-105"
            >
              İleri → {STEPS[step].title}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="bg-gold-gradient font-bold text-slate-900 shadow-md hover:brightness-105"
            >
              {submitMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditMode ? "Güncelleniyor..." : "İlan Oluşturuluyor..."}</>
              ) : (
                isEditMode ? "✓ İlanı Güncelle" : "✓ İlanı Oluştur"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
