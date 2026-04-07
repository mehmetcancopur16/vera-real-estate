"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { deleteAdminContact, getAdminContacts, markAdminContactRead } from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isReadQuery = filterRead === "all" ? undefined : filterRead;

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin-contacts", { page, search, isRead: isReadQuery }],
    queryFn: () =>
      getAdminContacts({
        page,
        limit: 15,
        search: search || undefined,
        isRead: isReadQuery,
      }),
    staleTime: 30_000,
  });

  const contacts = data?.data || [];
  const pagination = data?.pagination || {};
  const unreadInPage = contacts.filter((c) => !c.isRead).length;
  const readInPage = contacts.length - unreadInPage;
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count += 1;
    if (filterRead !== "all") count += 1;
    return count;
  }, [search, filterRead]);

  const markReadMutation = useMutation({
    mutationFn: markAdminContactRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Mesaj okundu olarak isaretlendi");
    },
    onError: () => toast.error("Islem basarisiz"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Mesaj silindi");
      setExpanded(null);
    },
    onError: () => toast.error("Silme basarisiz"),
  });

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setFilterRead("all");
    setPage(1);
  }

  function confirmDelete() {
    if (!deleteTarget?._id) return;
    deleteMutation.mutate(deleteTarget._id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-br from-white via-violet-50 to-indigo-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              Mesaj Operasyon Merkezi
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Iletisim Mesajlari
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Gelen kutusunu filtreleyin, okuyun, cevaplayin ve moderasyonu tek akista yonetin.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {pagination.total != null ? `${pagination.total} toplam mesaj` : "Yukleniyor..."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 border-violet-200 bg-white/80 hover:bg-violet-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <Button size="sm" className="gap-2 bg-violet-600 text-white hover:bg-violet-700" asChild>
              <Link href="/admin/users">
                <User className="h-4 w-4" />
                Kullanicilar
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bu sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{contacts.length}</p>
          <p className="mt-1 text-xs text-slate-500">Listelenen mesaj</p>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700">Okunmamis</p>
          <p className="mt-1 text-2xl font-extrabold text-orange-900">{unreadInPage}</p>
          <p className="mt-1 text-xs text-orange-700/80">Hizli donus bekleyen</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Okunmus</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-900">{readInPage}</p>
          <p className="mt-1 text-xs text-emerald-700/80">Incelenen mesajlar</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Toplam sayfa</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-900">{pagination.pages || 0}</p>
          <p className="mt-1 text-xs text-blue-700/80">Sayfalama durumu</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <Filter className="h-4 w-4 text-violet-500" />
            Filtreleme ve Arama
          </p>
          <Badge variant={activeFilterCount > 0 ? "default" : "secondary"} className="text-[10px] uppercase tracking-wide">
            {activeFilterCount > 0 ? `${activeFilterCount} aktif filtre` : "Varsayilan"}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Isim, email veya mesajda ara..."
                className="h-10 rounded-xl pl-9"
              />
            </div>
            <Button type="submit" size="sm" className="shrink-0">Ara</Button>
          </form>
          <Select
            value={filterRead}
            onValueChange={(value) => {
              setFilterRead(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 w-full sm:w-[180px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tum mesajlar</SelectItem>
              <SelectItem value="false">Okunmamis</SelectItem>
              <SelectItem value="true">Okunmus</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={clearFilters}>Temizle</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <MessageSquare className="h-10 w-10 text-slate-200" />
            <p className="text-sm font-medium text-slate-500">Mesaj bulunamadi</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <div key={contact._id} className={`transition ${!contact.isRead ? "bg-orange-50/30" : ""}`}>
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === contact._id ? null : contact._id)}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-violet-50/40"
                >
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${!contact.isRead ? "bg-orange-100" : "bg-slate-100"}`}>
                    <MessageSquare className={`h-4 w-4 ${!contact.isRead ? "text-orange-600" : "text-slate-400"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{contact.name}</span>
                      {!contact.isRead && (
                        <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
                          Yeni
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{contact.message}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400">{formatDate(contact.createdAt)}</span>
                </button>

                {expanded === contact._id && (
                  <div className="border-t border-slate-100 bg-white px-5 py-4">
                    <div className="mb-3 grid gap-2 text-sm sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <a href={`mailto:${contact.email}`} className="font-medium text-violet-600 hover:underline">
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{contact.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                      {contact.message}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {!contact.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markReadMutation.mutate(contact._id)}
                          disabled={markReadMutation.isPending}
                          className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCheck className="h-4 w-4" />
                          Okundu isaretle
                        </Button>
                      )}
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Mail className="h-4 w-4" />
                        Yanitla
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto gap-2 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTarget(contact)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Sil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm text-slate-500">
            Sayfa <span className="font-semibold text-slate-700">{pagination.page} / {pagination.pages}</span> ({pagination.total} mesaj)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPage((p) => p - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Onceki
            </Button>
            <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="gap-1">
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mesaji sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> kullanicisina ait mesaj kalici olarak silinecek. Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Iptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteMutation.isPending}
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
