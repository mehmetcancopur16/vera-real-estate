"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteMyProperty, getMyProperties } from "@/services/property.service";

function formatTry(price) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export default function MyListingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: () => getMyProperties({ page: 1, limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMyProperty(id),
    onSuccess: () => {
      toast.success("Ilan pasife alindi");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Silme islemi basarisiz");
    },
  });

  const items = data?.data || [];

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-3 rounded-xl border border-border p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="flex min-h-[55vh] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card p-6 text-center">
        <h1 className="text-2xl font-semibold">Henüz hic ilan eklemediniz.</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Yeni bir ilan olusturarak panelinizi doldurmaya hemen baslayabilirsiniz.
        </p>
        <Button asChild>
          <Link href="/add-listing">Yeni Ilan Ekle</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Ilanlarim</h1>
      <div className="rounded-xl border border-border">
        <Table>
          <TableCaption>Hesabiniza ait aktif ilanlar.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Gorsel</TableHead>
              <TableHead>Baslik</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Aksiyonlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((property) => (
              <TableRow key={property._id}>
                <TableCell>
                  <div className="relative h-14 w-24 overflow-hidden rounded-md border border-border">
                    <Image
                      src={
                        property.images?.[0] ||
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop"
                      }
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{formatTry(property.price)}</TableCell>
                <TableCell>{property.isActive ? "Aktif" : "Pasif"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(property._id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Siliniyor
                      </>
                    ) : (
                      "Sil"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
