"use client";

import { useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, Eye, EyeOff, Loader2, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { changePassword, deleteAccount, updateMe, uploadAvatar } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

function initialsFromName(name) {
  if (!name) return "VR";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const { user, refreshMe, logout } = useAuthStore();
  const initials = useMemo(() => initialsFromName(user?.name), [user?.name]);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [prefEmails, setPrefEmails] = useState(true);
  const [prefMarketing, setPrefMarketing] = useState(false);

  const avatarMutation = useMutation({
    mutationFn: async (file) => uploadAvatar(file),
    onSuccess: async () => {
      await refreshMe();
      toast.success("Avatar güncellendi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Avatar yüklenemedi");
    },
  });

  const updateMeMutation = useMutation({
    mutationFn: async () => updateMe({ name, email }),
    onSuccess: async () => {
      await refreshMe();
      toast.success("Profil güncellendi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Profil güncellenemedi");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Şifre güncellendi");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Şifre güncellenemedi");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => deleteAccount({ currentPassword: deletePassword }),
    onSuccess: () => {
      toast.success("Hesabınız silindi");
      logout();
      router.replace("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Hesap silinemedi");
    },
  });

  const onPickAvatar = () => fileRef.current?.click?.();

  const onAvatarFile = (file) => {
    if (!file) return;
    avatarMutation.mutate(file);
  };

  return (
    <section className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profil</h1>
          <p className="mt-1 text-sm text-slate-600">Hesap bilgilerinizi yönetin ve güvenliğinizi güncel tutun.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Premium panel
        </div>
      </div>

      <Tabs defaultValue="personal" className="gap-4">
        <TabsList className="w-full justify-start" variant="default">
          <TabsTrigger value="personal">Kişisel Bilgiler</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
          <TabsTrigger value="preferences">Tercihler</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="rounded-full ring-2 ring-accent/50 p-1">
                    <Avatar size="lg" className="bg-slate-100">
                      <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "avatar"} />
                      <AvatarFallback className="bg-slate-900 text-white">{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <button
                    type="button"
                    onClick={onPickAvatar}
                    className="absolute -bottom-1 -right-1 inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    aria-label="avatar-upload"
                  >
                    {avatarMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 text-accent" />
                    )}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onAvatarFile(e.target.files?.[0])}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">Premium Üyelik</p>
                  <p className="mt-1 truncate text-lg font-semibold text-slate-900">{user?.name || "Kullanıcı"}</p>
                  <p className="mt-1 truncate text-sm text-slate-600">{user?.email || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <Button
                  type="button"
                  className="bg-accent text-primary hover:bg-[var(--gold-hover)]"
                  onClick={() => updateMeMutation.mutate()}
                  disabled={updateMeMutation.isPending}
                >
                  {updateMeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    "Değişiklikleri Kaydet"
                  )}
                </Button>
                <p className="text-xs text-slate-500">İsterseniz avatarınızı da güncelleyebilirsiniz.</p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Ad Soyad</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" />
              </div>
              <div className="grid gap-2">
                <Label>E-posta</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@ornek.com" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white ring-1 ring-slate-900">
                <User className="h-5 w-5 text-accent" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Şifre Güvenliği</p>
                <p className="text-sm text-slate-600">Hesabınızı korumak için şifrenizi düzenli aralıklarla güncelleyin.</p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Mevcut Şifre</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-900"
                    aria-label="toggle-current"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Yeni Şifre</Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-900"
                    aria-label="toggle-new"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                className="bg-accent text-primary hover:bg-[var(--gold-hover)]"
                onClick={() => changePasswordMutation.mutate()}
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  "Şifreyi Güncelle"
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Hesabı Sil</p>
            <p className="mt-1 text-sm text-slate-600">
              Bu işlem geri alınamaz. Hesabınız ve tüm ilanlarınız kalıcı olarak silinecektir.
            </p>

            <Separator className="my-5" />

            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div className="grid gap-2">
                <Label>Şifreniz</Label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Onay için şifrenizi girin"
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 md:w-auto"
                      disabled={!deletePassword || deleteAccountMutation.isPending}
                    />
                  }
                >
                  Hesabı Sil
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="text-red-600">
                      <AlertCircle />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Hesabınızı Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Hesabınız ve tüm ilanlarınız veritabanından kalıcı olarak silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                      onClick={() => deleteAccountMutation.mutate()}
                      disabled={deleteAccountMutation.isPending}
                    >
                      {deleteAccountMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Siliniyor...
                        </>
                      ) : (
                        "Evet, Hesabı Sil"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Bildirim & Tercihler</p>
            <p className="mt-1 text-sm text-slate-600">Bu ayarlar şimdilik arayüz amaçlıdır; istenirse backend’e bağlarız.</p>

            <Separator className="my-5" />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">E-posta bildirimleri</p>
                  <p className="text-sm text-slate-600">İlan performansı ve önemli güncellemeler.</p>
                </div>
                <Switch checked={prefEmails} onCheckedChange={setPrefEmails} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Pazarlama içerikleri</p>
                  <p className="text-sm text-slate-600">Yeni özellikler ve kampanyalar.</p>
                </div>
                <Switch checked={prefMarketing} onCheckedChange={setPrefMarketing} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

