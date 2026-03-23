"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Baslik</FormLabel>
              <FormControl>
                <Input placeholder="Orn: Merkezde modern daire" {...field} />
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
              <FormLabel>Aciklama</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Ilan detaylari..." {...field} />
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
                  <SelectTrigger>
                    <SelectValue placeholder="Tip secin" />
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
              <FormLabel>Ilan Turu</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tur secin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sale">Satilik</SelectItem>
                  <SelectItem value="rent">Kiralik</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sehir</FormLabel>
              <FormControl>
                <Input placeholder="Istanbul" {...field} />
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
              <FormLabel>Ilce</FormLabel>
              <FormControl>
                <Input placeholder="Besiktas" {...field} />
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
                <Input placeholder="Acik adres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 grid gap-2">
          <FormLabel>Gorseller</FormLabel>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={submitMutation.isPending}>
            {submitMutation.isPending ? "Kaydediliyor..." : "Ilani Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
