# Component Design Guidelines

Bu dokuman, frontend tarafinda premium-sade tasarim dilinin kalici ve tekrar kullanilabilir olmasi icin hazirlandi.

## 1) Design Tokens ve Renk Sistemi

Ana kaynak: `app/globals.css`

- Temel tokenlar:
  - `--background`, `--foreground`, `--card`, `--border`, `--ring`
  - `--primary`, `--secondary`, `--accent`, `--gold`, `--gold-hover`
- Ara renk ve yuzey tokenlari:
  - `--surface`, `--surface-elevated`, `--surface-soft`
  - `--accent-soft`, `--accent-strong`, `--text-subtle`, `--header`
- Utility siniflari:
  - `bg-gold-gradient`: birincil CTA ve premium vurgu
  - `bg-surface-gradient`: sayfa/section arka plan katmani
  - `text-gradient-gold`: marka baslik vurgu metni
  - `premium-ring`: premium glow + ince ring etkisi

Kural:
- Yeni component gelistirirken hardcoded hex yerine token kullan.
- Birincil aksiyonlarda oncelik `bg-gold-gradient`.

## 2) Motion Standardi

- Motion prensibi: "kisa, yumusak, dikkat dagitmayan".
- Oncelikli teknikler: `transform` + `opacity`.
- Onerilen gecis:
  - `duration-150` ile `duration-300` arasi
  - `ease-out` veya varsayilan yumusak easing
- Hover davranisi:
  - Hafif lift: `hover:-translate-y-0.5` veya `hover:-translate-y-1`
  - Gerekirse `hover:shadow-md` veya `hover:shadow-xl`
- Accessibility:
  - `prefers-reduced-motion: reduce` ile hareket minimuma iner.

Kural:
- Asiri bounce, uzun sureli loop veya dikkat dagitan animasyon kullanma.

## 3) Ikonografi Standardi (`lucide-react`)

- Varsayilan ikon boyutlari:
  - Inline: `h-4 w-4`
  - Yardimci/ikincil: `h-3.5 w-3.5`
  - Hero/feature: `h-5 w-5` veya `h-6 w-6`
- Icerik ikonlari:
  - Metinle birlikte kullaniliyorsa `inline-flex items-center gap-1/2`.
- Vurgu renkleri:
  - Birincil vurgu: `text-accent`
  - Nötr durum: `text-muted-foreground` veya `text-slate-500` (mevcut kod ile uyumlu alanlarda)

Kural:
- Ayni satirdaki ikon boyutlari tutarli olmali.
- Bir component icinde en fazla bir baskin renkli ikon kullan.

## 4) Primitive Kurallari

### `Button`
- Kaynak: `components/ui/button.tsx`
- Variant hedefleri:
  - `default`: ana eylem
  - `outline`: ikincil eylem
  - `ghost`: dusuk oncelik
  - `destructive`: tehlikeli eylem
- Davranis:
  - Focus ring zorunlu
  - Disabled durumda opaklik dusmeli, pointer kapanmali
  - Hover lift yalnizca hafif seviyede olmali

### `Badge`
- Kaynak: `components/ui/badge.tsx`
- Kisa ve durum odakli etiketler icin kullan.
- Status badgelerde metin + nokta kombinasyonu tercih edilebilir.

### `Dialog`
- Kaynak: `components/ui/dialog.tsx`
- Overlay hafif blur + opak siyah katman ile gelmeli.
- Dialog penceresinde radius ve shadow derinligi korunmali.

### `DropdownMenu`
- Kaynak: `components/ui/dropdown-menu.tsx`
- Acilir menulerde radius/shadow tutarliligi korunmali.
- Destroy islemler mutlaka destructive tonla ayrismali.

## 5) Layout Patternleri

### Navbar
- Marka adi gradient text vurgu alabilir (`text-gradient-gold`).
- Header arka plani yari saydam koyu ton + blur ile kalmali.
- Mobil menude desktop ile ayni CTA hiyerarsisi olmali.

### Footer
- Ustte ince premium gradient cizgi kullanilabilir.
- Sosyal ikonlar hafif hover lift ile canlanmali.
- Bulten formu CTA'si birincil gradient standardini kullanmali.

### Dashboard Shell
- Sidebar + main panel ayni border/surface ailesinden secilmeli.
- KPI kartlari ayni radius/shadow ritmini izlemeli.

## 6) Sayfa Patternleri

### Hero Section
- Arka plan gorseli + koyu overlay + okunakli beyaz metin.
- Fazla efekt yerine 1-2 odakli vurgu (badge + premium ring).

### Card Grid
- Kartlar: `border + surface + yumuşak hover lift`.
- Gorsel alaninda hafif zoom ve gradient overlay kullanilabilir.

### Form Panel
- Input focus durumlari net gorunur olmalı.
- Primary submit button daima fark edilir olmalı.

### Detail + Sidebar
- Sol icerik ve sag aksiyon paneli ayni tasarim dilini paylasmali.
- Birincil/ikincil aksiyonlar kontrastla ayrilmali.

## 7) Do / Don't

Do:
- Token tabanli renk kullan.
- Birincil CTA'da ortak gradient dili uygula.
- Focus durumlarini gorunur tut.
- Motion'u performans dostu (transform/opacity) tut.

Don't:
- Rastgele hex kodlar ekleme.
- Her elemana glow/gradient verme.
- Uzun, dikkat dagitan animasyonlar kullanma.
- Ayni sayfada farkli buton dillerini karistirma.

## 8) Quick Review Checklist (PR Oncesi)

- Yeni eklenen component token disi renk kullaniyor mu?
- Primary/secondary/destructive ayrimi net mi?
- Icon boyutlari satir icinde tutarli mi?
- Keyboard focus gorunur mu?
- Reduced motion acikken hareketler azaliyor mu?
