"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  Check,
  Crown,
  Eye,
  EyeOff,
  Globe,
  Key,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  Moon,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  User,
  UserCog,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import {
  changePassword,
  deleteAccount,
  updateMe,
  uploadAvatar,
} from "@/services/auth.service";
import { getMyProperties } from "@/services/property.service";
import { useAuthStore } from "@/store/useAuthStore";

/* ─── helpers ─── */
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

function formatJoinDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
}

/* ─── password strength ─── */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 20, label: "Çok Zayıf", color: "bg-red-500" };
  if (score === 2) return { score: 40, label: "Zayıf", color: "bg-orange-500" };
  if (score === 3) return { score: 60, label: "Orta", color: "bg-yellow-500" };
  if (score === 4) return { score: 80, label: "Güçlü", color: "bg-blue-500" };
  return { score: 100, label: "Çok Güçlü", color: "bg-green-500" };
}

/* ─── preference key ─── */
const PREF_KEY = "vera_user_preferences";

function loadPrefs() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

/* ─── main page ─── */
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
  const [showDeletePw, setShowDeletePw] = useState(false);

  const prefs = loadPrefs();
  const [prefEmails, setPrefEmails] = useState(prefs.emails ?? true);
  const [prefMarketing, setPrefMarketing] = useState(prefs.marketing ?? false);
  const [prefDarkMode, setPrefDarkMode] = useState(prefs.darkMode ?? false);
  const [prefNewsletter, setPrefNewsletter] = useState(prefs.newsletter ?? false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const togglePref = (key, setter, value) => {
    const next = !value;
    setter(next);
    savePrefs({ ...loadPrefs(), [key]: next });
  };

  const pwStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  /* listing count */
  const { data: myPropertiesData } = useQuery({
    queryKey: ["my-properties", { includeInactive: 1 }],
    queryFn: () => getMyProperties({ page: 1, limit: 50, includeInactive: 1 }),
  });
  const totalListings = myPropertiesData?.data?.length ?? 0;
  const activeListings = myPropertiesData?.data?.filter((p) => p.isActive).length ?? 0;

  /* mutations */
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
    mutationFn: async () =>
      deleteAccount({ currentPassword: deletePassword }),
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

      {/* ── Profile Hero Card ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl animate-float-delayed" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          {/* Avatar + name */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="rounded-full p-1 ring-2 ring-accent/60 animate-glow-pulse">
                <Avatar className="h-20 w-20 bg-slate-800 shadow-2xl">
                  <AvatarImage
                    src={user?.avatarUrl || ""}
                    alt={user?.name || "avatar"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-xl font-black text-accent">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <button
                type="button"
                onClick={onPickAvatar}
                className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-800 bg-gradient-to-br from-accent to-amber-400 shadow-lg transition hover:scale-110 hover:brightness-110"
                aria-label="avatar-upload"
              >
                {avatarMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
                ) : (
                  <Upload className="h-4 w-4 text-slate-900" />
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

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
                <Sparkles className="h-2.5 w-2.5 text-accent" />
                Premium Üye
              </div>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight">
                {user?.name || "Kullanıcı"}
              </h2>
              <p className="mt-0.5 text-sm text-white/60">{user?.email || "—"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-black text-white">{totalListings}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                İlan
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-black text-green-400">{activeListings}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                Aktif
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
              <p className="text-sm font-bold text-white/90 leading-tight">
                {formatJoinDate(user?.createdAt)}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                Üyelik
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="w-full justify-start gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <User className="h-4 w-4" />
            Kişisel Bilgiler
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4" />
            Tercihler
          </TabsTrigger>
          <TabsTrigger
            value="subscription"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Zap className="h-4 w-4" />
            Abonelik
          </TabsTrigger>
        </TabsList>

        {/* ── Personal Tab ── */}
        <TabsContent value="personal" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <div className="panel-surface rounded-2xl p-6 shadow-sm">

            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <UserCog className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="font-bold text-slate-900">Kişisel Bilgiler</p>
                <p className="text-xs text-slate-500">Ad, soyad ve e-posta adresinizi güncelleyin</p>
              </div>
            </div>

            <Separator className="mb-5" />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User className="h-3.5 w-3.5 text-accent" />
                  Ad Soyad
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ad Soyad"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-accent/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  E-posta
                </Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@ornek.com"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:bg-white focus-visible:ring-accent/40"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Avatarınızı değiştirmek için profil resminizdeki kamera ikonuna tıklayın.
              </p>
              <Button
                type="button"
                className="bg-gold-gradient text-primary hover:brightness-95 shadow-md shadow-amber-900/20 px-6"
                onClick={() => updateMeMutation.mutate()}
                disabled={updateMeMutation.isPending}
              >
                {updateMeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── Security Tab ── */}
        <TabsContent value="security" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">

          {/* Password change */}
          <div className="panel-surface rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                <Key className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="font-bold text-slate-900">Şifre Güvenliği</p>
                <p className="text-xs text-slate-500">
                  Hesabınızı korumak için şifrenizi düzenli olarak güncelleyin
                </p>
              </div>
            </div>

            <Separator className="mb-5" />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  Mevcut Şifre
                </Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-10 focus-visible:bg-white focus-visible:ring-accent/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                    aria-label="toggle-current"
                  >
                    {showCurrent ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Shield className="h-3.5 w-3.5 text-slate-500" />
                  Yeni Şifre
                </Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-10 focus-visible:bg-white focus-visible:ring-accent/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                    aria-label="toggle-new"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password strength meter */}
                {newPassword.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={[
                          "h-full rounded-full transition-all duration-500",
                          pwStrength.color,
                        ].join(" ")}
                        style={{ width: `${pwStrength.score}%` }}
                      />
                    </div>
                    <p className={[
                      "text-xs font-semibold",
                      pwStrength.score <= 20 ? "text-red-600" :
                      pwStrength.score <= 40 ? "text-orange-600" :
                      pwStrength.score <= 60 ? "text-yellow-600" :
                      pwStrength.score <= 80 ? "text-blue-600" :
                      "text-green-600",
                    ].join(" ")}>
                      Şifre gücü: {pwStrength.label}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                className="bg-gold-gradient text-primary hover:brightness-95 shadow-md px-6"
                onClick={() => changePasswordMutation.mutate()}
                disabled={
                  changePasswordMutation.isPending ||
                  !currentPassword ||
                  !newPassword
                }
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Şifreyi Güncelle
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Delete account */}
          <div className="overflow-hidden rounded-2xl border-2 border-red-200/70 bg-gradient-to-br from-red-50 to-rose-50 shadow-sm">
            <div className="border-b border-red-200/50 bg-red-100/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
                  <AlertCircle className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="font-bold text-red-900">Tehlikeli Bölge</p>
                  <p className="text-xs text-red-700">
                    Bu işlemler geri alınamaz, dikkatli olun
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm font-semibold text-slate-800">Hesabı Sil</p>
              <p className="mt-1 text-sm text-slate-600">
                Hesabınız ve tüm ilanlarınız kalıcı olarak silinecektir. Bu işlem geri alınamaz.
              </p>

              <Separator className="my-4 border-red-200/70" />

              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-semibold text-red-800">
                    <Key className="h-3.5 w-3.5" />
                    Onay için şifrenizi girin
                  </Label>
                  <div className="relative">
                    <Input
                      type={showDeletePw ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Şifrenizi girin"
                      className="h-11 rounded-xl border-red-200 bg-white pr-10 focus-visible:ring-red-400/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-red-400 transition hover:text-red-600"
                    >
                      {showDeletePw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full rounded-xl border-red-300 bg-white text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition md:w-auto px-5 font-semibold"
                        disabled={!deletePassword || deleteAccountMutation.isPending}
                      />
                    }
                  >
                    Hesabı Sil
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="text-red-500">
                        <AlertCircle className="animate-bounce" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>
                        Hesabınızı Silmek İstediğinize Emin Misiniz?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem geri alınamaz. Hesabınız ve{" "}
                        <strong className="text-slate-800">tüm {totalListings} ilanınız</strong> veritabanından kalıcı olarak silinecektir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => deleteAccountMutation.mutate()}
                        disabled={deleteAccountMutation.isPending}
                      >
                        {deleteAccountMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Siliniyor...
                          </>
                        ) : (
                          "Evet, Hesabımı Sil"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Preferences Tab ── */}
        <TabsContent value="preferences" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <div className="panel-surface rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
                <Settings className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="font-bold text-slate-900">Bildirim & Tercihler</p>
                <p className="text-xs text-slate-500">
                  Tercihleriniz tarayıcınızda kaydedilir
                </p>
              </div>
            </div>

            <Separator className="mb-5" />

            <div className="space-y-3">
              <PreferenceRow
                icon={Bell}
                iconGradient="from-blue-500 to-indigo-600"
                title="E-posta Bildirimleri"
                desc="İlan performansı, önemli güncellemeler ve sistem bildirimleri"
                checked={prefEmails}
                onCheckedChange={() => togglePref("emails", setPrefEmails, prefEmails)}
              />

              <PreferenceRow
                icon={Megaphone}
                iconGradient="from-pink-500 to-rose-500"
                title="Pazarlama İçerikleri"
                desc="Yeni özellikler, kampanyalar ve özel teklifler"
                checked={prefMarketing}
                onCheckedChange={() => togglePref("marketing", setPrefMarketing, prefMarketing)}
              />

              <PreferenceRow
                icon={Globe}
                iconGradient="from-emerald-500 to-teal-500"
                title="Haftalık Bülten"
                desc="Emlak piyasası haberleri ve fiyat endeksleri"
                checked={prefNewsletter}
                onCheckedChange={() => togglePref("newsletter", setPrefNewsletter, prefNewsletter)}
              />

              <PreferenceRow
                icon={Moon}
                iconGradient="from-slate-600 to-slate-800"
                title="Koyu Tema"
                desc="Arayüzü koyu renk paletinde kullanın"
                checked={prefDarkMode}
                onCheckedChange={() => togglePref("darkMode", setPrefDarkMode, prefDarkMode)}
              />
            </div>
          </div>

          {/* Activity info card */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow">
                <Star className="h-4 w-4 text-white" />
              </span>
              <p className="font-bold text-slate-900 text-sm">Hesap Özeti</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-xl font-black text-slate-900">{totalListings}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mt-0.5">
                  Toplam İlan
                </p>
              </div>
              <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-center">
                <p className="text-xl font-black text-green-700">{activeListings}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-green-600 mt-0.5">
                  Aktif
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                <p className="text-sm font-bold text-slate-700 leading-tight">
                  {formatJoinDate(user?.createdAt)}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mt-0.5">
                  Üyelik
                </p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-3 text-center">
                <p className="text-sm font-black text-violet-700">Premium</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-500 mt-0.5">
                  Plan
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Subscription Tab ── */}
        <TabsContent value="subscription" className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <SubscriptionTab user={user} totalListings={totalListings} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

/* ─── Subscription Tab ─── */
const PLAN_DETAILS = {
  free: {
    label: "Free",
    price: "Ücretsiz",
    priceNote: "Sonsuza kadar",
    color: "from-slate-500 to-slate-700",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-200",
    icon: Zap,
    hint: "3 ilan hakkı",
    next: "professional",
    nextLabel: "Professional",
    nextColor: "from-blue-600 to-indigo-600",
    features: [
      "3 ilan yayınlama hakkı",
      "Standart ilan görünürlüğü",
      "Temel arama filtreleri",
      "E-posta desteği",
    ],
  },
  professional: {
    label: "Professional",
    price: "₺299",
    priceNote: "/ ay",
    color: "from-blue-500 to-indigo-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    icon: Star,
    hint: "7 ilan hakkı",
    next: "corporate",
    nextLabel: "Corporate",
    nextColor: "from-amber-500 to-orange-500",
    features: [
      "7 ilan yayınlama hakkı",
      "Öne çıkarılmış ilan seçeneği",
      "Gelişmiş arama filtreleri",
      "Öncelikli e-posta desteği",
      "İlan istatistikleri",
      "Özel profil rozeti",
    ],
  },
  corporate: {
    label: "Corporate",
    price: "₺799",
    priceNote: "/ ay",
    color: "from-amber-500 to-orange-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    icon: Crown,
    hint: "Sınırsız ilan",
    next: null,
    features: [
      "Sınırsız ilan yayınlama",
      "Premium ilan görünürlüğü",
      "Tüm gelişmiş filtreler",
      "7/24 öncelikli destek",
      "Detaylı analitik raporlar",
      "Kurumsal profil rozeti",
      "API erişimi",
      "Özel müşteri temsilcisi",
    ],
  },
};

const PLAN_LIMITS_SUB = { free: 3, professional: 7, corporate: Infinity };

function SubscriptionTab({ user, totalListings }) {
  const plan = user?.subscription?.plan || "free";
  const expiresAt = user?.subscription?.expiresAt;
  const ps = PLAN_DETAILS[plan] || PLAN_DETAILS.free;
  const PlanIcon = ps.icon;
  const limit = PLAN_LIMITS_SUB[plan];
  const usedPct = limit === Infinity ? 0 : Math.min(100, Math.round((totalListings / limit) * 100));
  const barColor = usedPct >= 100 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  const renewalDate = expiresAt && plan !== "free"
    ? new Date(expiresAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <div className="space-y-5">

      {/* ── Hero plan card ── */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${ps.color} p-7 text-white shadow-2xl`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-black/10 blur-xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/30 shadow-lg">
              <PlanIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Aktif Plan
              </span>
              <p className="mt-1 text-2xl font-extrabold">{ps.label}</p>
              <p className="text-sm text-white/70">{ps.hint}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-extrabold tabular-nums">{ps.price}</p>
            <p className="text-sm text-white/60">{ps.priceNote}</p>
          </div>
        </div>

        {/* Renewal / billing info */}
        <div className="relative mt-5 flex flex-wrap gap-3">
          {renewalDate ? (
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 text-white/70" />
              <span className="font-semibold">Yenileme: <span className="text-white">{renewalDate}</span></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-white/70" />
              <span className="font-semibold text-white/80">Süresiz ücretsiz plan</span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs backdrop-blur-sm">
            <Building2 className="h-3.5 w-3.5 text-white/70" />
            <span className="font-semibold text-white/80">
              {totalListings}{limit !== Infinity ? `/${limit}` : ""} ilan kullanıldı
            </span>
          </div>
        </div>

        {/* Usage bar */}
        {limit !== Infinity && (
          <div className="relative mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-white/70">
              <span>İlan Limiti</span>
              <span className="font-bold text-white">{Math.round(usedPct)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${usedPct}%`, opacity: usedPct >= 100 ? 1 : 0.85 }}
              />
            </div>
            {usedPct >= 80 && (
              <p className="mt-1.5 text-[11px] font-semibold text-white/80">
                {usedPct >= 100 ? "Limite ulaştınız — planı yükseltin." : "Limite yaklaşıyorsunuz."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Plan features ── */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${ps.color} shadow`}>
            <PlanIcon className="h-4 w-4 text-white" />
          </span>
          <p className="font-bold text-foreground">{ps.label} Plan Özellikleri</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ps.features.map((f) => (
            <div key={f} className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background px-3.5 py-2.5">
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Billing details ── */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <p className="mb-4 font-bold text-foreground">Fatura Bilgileri</p>
        <div className="space-y-3">
          {[
            { label: "Plan", value: ps.label },
            { label: "Fiyat", value: plan === "free" ? "Ücretsiz" : `${ps.price} / ay` },
            { label: "Durum", value: "Aktif", valueClass: "text-emerald-600 font-bold" },
            { label: "Sonraki Yenileme", value: renewalDate || "Süresiz" },
            { label: "İlan Kullanımı", value: limit === Infinity ? `${totalListings} (Sınırsız)` : `${totalListings} / ${limit}` },
          ].map(({ label, value, valueClass }) => (
            <div key={label} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <span className="text-sm text-slate-500">{label}</span>
              <span className={`text-sm font-semibold text-foreground ${valueClass || ""}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Upgrade CTA (if not corporate) ── */}
      {ps.next && (
        <div className="relative overflow-hidden rounded-3xl bg-primary p-6 premium-ring">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(212,175,55,0.15),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Bir Adım Üst Seviye</p>
              <p className="mt-1.5 text-lg font-bold text-white">
                {ps.nextLabel} Planına Geçin
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {ps.next === "professional" ? "7 ilan, öne çıkarma ve daha fazlası" : "Sınırsız ilan, API erişimi ve özel temsilci"}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <a
                href={`/upgrade/checkout?plan=${ps.next}`}
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${ps.nextColor} px-5 py-2.5 text-sm font-extrabold text-white shadow-lg transition hover:brightness-105 hover:-translate-y-0.5`}
              >
                <Sparkles className="h-4 w-4" />
                Yükselt →
              </a>
              <a
                href="/upgrade"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-accent/40 hover:text-accent"
              >
                Tüm Planlar
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Corporate badge ── */}
      {plan === "corporate" && (
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-orange-50 to-white p-6 text-center shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.1),transparent_70%)]" />
          <Crown className="relative mx-auto mb-3 h-10 w-10 text-amber-500" />
          <p className="relative text-lg font-extrabold text-amber-900">Corporate Plan Aktif</p>
          <p className="relative mt-1 text-sm text-amber-700">Sınırsız ilan ve tüm premium özellikler açık.</p>
          <div className="relative mt-4 flex flex-wrap justify-center gap-2">
            {["Sınırsız İlan", "API Erişimi", "Özel Temsilci", "7/24 Destek"].map((badge) => (
              <span key={badge} className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Plan değiştir bağlantısı (professional/corporate) */}
      {plan !== "free" && (
        <div className="flex items-center justify-center">
          <a href="/upgrade" className="text-xs text-slate-400 transition hover:text-slate-600 hover:underline underline-offset-2">
            Planı değiştir veya iptal et →
          </a>
        </div>
      )}
    </div>
  );
}

/* ─── Preference row component ─── */
function PreferenceRow({ icon: Icon, iconGradient, title, desc, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={[
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow",
            iconGradient,
          ].join(" ")}
        >
          <Icon className="h-4 w-4 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{desc}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </div>
  );
}
