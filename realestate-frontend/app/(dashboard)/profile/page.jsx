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
function SubscriptionTab({ user, totalListings }) {
  const plan = user?.subscription?.plan || "free";
  const expiresAt = user?.subscription?.expiresAt;

  const PLAN_LIMITS = { free: 3, professional: 7, corporate: Infinity };
  const limit = PLAN_LIMITS[plan];
  const usedPct = limit === Infinity ? 0 : Math.min(100, Math.round((totalListings / limit) * 100));

  const planStyles = {
    free: { label: "Free", color: "from-slate-400 to-slate-600", badge: "bg-slate-100 text-slate-700 border-slate-200", icon: Zap, hint: "3 ilan hakkı", next: "professional" },
    professional: { label: "Professional", color: "from-blue-500 to-indigo-600", badge: "bg-blue-50 text-blue-700 border-blue-200", icon: Star, hint: "7 ilan hakkı", next: "corporate" },
    corporate: { label: "Corporate", color: "from-amber-500 to-orange-500", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: Sparkles, hint: "Sınırsız ilan", next: null },
  };
  const ps = planStyles[plan] || planStyles.free;
  const PlanIcon = ps.icon;

  const barColor = usedPct >= 100 ? "bg-red-500" : usedPct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="space-y-4">
      {/* Current plan card */}
      <div className="panel-surface rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${ps.color} shadow-lg`}>
              <PlanIcon className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-lg font-extrabold text-slate-900">{ps.label} Plan</p>
              <p className="text-sm text-slate-500">{ps.hint}</p>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${ps.badge}`}>
            Aktif
          </span>
        </div>

        {expiresAt && plan !== "free" && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
            <span className="font-semibold">Son geçerlilik:</span>{" "}
            {new Date(expiresAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        )}

        {/* Usage bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">İlan Kullanımı</span>
            <span className="font-extrabold text-slate-900">
              {totalListings}{limit !== Infinity && `/${limit}`}
              {limit !== Infinity && <span className="text-xs font-medium text-slate-400 ml-1">ilan</span>}
              {limit === Infinity && <span className="text-xs font-medium text-slate-400 ml-1">ilan (sınırsız)</span>}
            </span>
          </div>
          {limit !== Infinity && (
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${usedPct}%` }}
              />
            </div>
          )}
          {limit !== Infinity && usedPct >= 80 && (
            <p className={`mt-1.5 text-xs font-medium ${usedPct >= 100 ? "text-red-600" : "text-amber-600"}`}>
              {usedPct >= 100 ? "Plan limitine ulaştınız! Planınızı yükseltin." : "Plan limitine yaklaşıyorsunuz."}
            </p>
          )}
        </div>
      </div>

      {/* Upgrade CTA */}
      {ps.next && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-5 text-center">
          <p className="text-sm font-semibold text-slate-600 mb-3">
            Daha fazla ilan için planınızı yükseltin
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a
              href={`/upgrade/checkout?plan=${ps.next}`}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${ps.color} px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:brightness-105`}
            >
              <Sparkles className="h-4 w-4" />
              {planStyles[ps.next]?.label} Planına Geç
            </a>
            <a
              href="/upgrade"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Tüm Planlar
            </a>
          </div>
        </div>
      )}

      {plan === "corporate" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
          <Crown className="mx-auto mb-2 h-8 w-8 text-amber-500" />
          <p className="font-extrabold text-amber-900">Corporate Plan Aktif</p>
          <p className="text-sm text-amber-700 mt-1">Sınırsız ilan yayınlama hakkına sahipsiniz.</p>
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
