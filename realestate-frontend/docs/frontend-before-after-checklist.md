# Frontend Before/After Checklist

Bu dokuman, premium-sade redesign sonrasinda sayfa bazli kalite kontrolunu standartlastirmak icin hazirlandi.

## Kontrol Sutunlari
- Renk ve token uyumu
- Tipografi ve hiyerarsi
- Spacing ve yerlesim ritmi
- CTA ve ikon tutarliligi
- Mikro-etkilesim ve motion
- Erisilebilirlik (focus, kontrast, reduced motion)

## Public Pages

### `app/(public)/page.jsx` (Ana Sayfa)
- Before: Hero, arama paneli, kartlar ve CTA tonlari parcaliydi.
- After: Hero premium ring ile vurgulandi; CTA butonlari ortak gradient diliyle hizalandi.
- Verify:
  - Hero blokta premium parlama ve derinlik hissi var.
  - Arama/section gecislerinde renk paleti disina cikilmiyor.
  - Kart hover davranislari yumuşak ve dikkat dagitmadan calisiyor.

### `app/(public)/properties/page.jsx` (Ilan Listesi)
- Before: Filter panel ve sonuc panelinde gorunumsel farklilik vardi.
- After: Panel kenarlari/surface kullanimi token tabanli tek stile cekildi.
- Verify:
  - Sol filtre paneli ve sag sonuc paneli ayni surface/border dilini kullaniyor.
  - Aktif filtre chip ve butonlar palette uyumlu.
  - Bos/error/loading durumlari tutarli gorunuyor.

### `app/(public)/properties/[id]/page.jsx` (Ilan Detay)
- Before: Detay kartlari, sidebar ve birincil aksiyonlar tek dilde degildi.
- After: Tum kartlar token tabanli border/surface ile birlestirildi; ana CTA gradient oldu.
- Verify:
  - Hero gorsel, bilgi kartlari ve sidebar ayni tasarim ailesinde.
  - "Iletisime Gec" birincil CTA net sekilde ayrisiyor.
  - Ikincil aksiyonlar (randevu/paylas) birincille yarismiyor.

### `app/(public)/about/page.jsx`
- Before: Hero ve metin kartlari arasinda premium ton farki zayifti.
- After: Hero ve metrik bolumu premium ring + palette uyumlu vurgu kazandi.
- Verify:
  - Hero overlay metin okunurlugu yuksek.
  - Kartlarin hover davranisi sakin ve tutarli.
  - Metrik bolum ana renk diliyle uyumlu.

### `app/(public)/contact/page.jsx`
- Before: Bilgi paneli ve form panelinde CTA ayrimi zayifti.
- After: Kartlar token bazli guncellendi; submit butonu ortak gradient standardina alindi.
- Verify:
  - Form paneli ve adres paneli dengeli gorunuyor.
  - Form focus ve hata durumlari belirgin.
  - Submit butonu oncelik hiyerarsisinde dogru yerde.

### `app/(public)/blog/page.jsx`
- Before: Blog kartlarinda genel sistemle uyum eksikligi vardi.
- After: Kart bordur/surface dili ve hero cizgisi genel sistemle hizalandi.
- Verify:
  - Kart hover hareketi asiri degil, premium-sade.
  - Hero ve kategori basliklari ana tipografi ritmine uyuyor.
  - Ikon ve link davranislari tutarli.

### `app/(public)/privacy-policy/page.jsx`
- Before: Duz metin gorunumu sistem dilinden kopuktu.
- After: Header section token tabanli arka plan/border ile sistemlestirildi.
- Verify:
  - Baslik blogu ile icerik blogu arasinda net hiyerarsi var.
  - Uzun metin okunabilir satir yogunlugunda.
  - Contrast uzun okumada yeterli.

### `app/(public)/terms-of-service/page.jsx`
- Before: Gizlilik sayfasiyla paralel ama yetersiz sistem baglantisi vardi.
- After: Privacy ile ayni gorunumsel kalipta sistematiklestirildi.
- Verify:
  - Privacy sayfasiyla ikiz tasarim dili var.
  - Baslik seviyeleri ve alt cizgi ritmi tutarli.
  - Uzun metin okuma akisi bozulmuyor.

## Auth Pages

### `app/(auth)/login/page.jsx`
- Before: Form kapsayici ve CTA stili global dil ile tam uyumlu degildi.
- After: Form card surface/border tokenlari ve gradient CTA ile hizalandi.
- Verify:
  - Sol gorsel panel + sag form panel dengeli.
  - Input focus durumlari net ve rahatsiz etmiyor.
  - Loading state ikon/motion olarak tutarli.

### `app/(auth)/register/page.jsx`
- Before: Login ile benzer ama ton farklari vardi.
- After: Login ile ayni premium-sade pattern'e cekildi.
- Verify:
  - Register ve Login visual parity korunuyor.
  - Sifre goster/gizle butonlari rahat kullaniliyor.
  - Terms dialog acilis/kapanis davranisi akici.

## Dashboard Pages

### `app/(dashboard)/my-listings/page.jsx`
- Before: CTA ve panel stili public/auth tarafiyla tam hizali degildi.
- After: Gradient CTA dili ve panel surface standardi uygulandi.
- Verify:
  - KPI kartlari ayni border/shadow ailesinde.
  - Grid/list toggle durumlari net.
  - Empty/loading/error durumlari tipografik olarak tutarli.

### `app/(dashboard)/profile/page.jsx`
- Before: Kaydet/sifre aksiyonlarinda renk dili parcaliydi.
- After: Kritik aksiyonlar ortak gradient sistemiyle birlestirildi.
- Verify:
  - Tabs icinde kartlar ayni spacing ve radius sistemini kullaniyor.
  - Buton oncelikleri (primary/secondary/destructive) net.
  - Alert/Dialog akisinda focus kaybi yok.

### `app/(dashboard)/add-listing/page.jsx`
- Before: Form shell sade ama sistem dokusuyla zayif bagliydi.
- After: Dashboard shell ile tam uyumlu kapsayici dilinde kullaniliyor.
- Verify:
  - Form container border/surface dashboard ile uyumlu.
  - Baslik ve aciklama hiyerarsisi dogru.
  - Cok adimli akislarinda buton davranislari tutarli.

## Global Controls
- `Navbar`, `Footer`, `PublicLayout`, `DashboardLayout` ayni premium-sade dilde calismali.
- Tum birincil CTA'larda ortak gradient dili korunmali.
- Reduced motion acik oldugunda animasyonlar minimuma inmeli.
