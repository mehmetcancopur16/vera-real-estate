import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock3,
  Globe2,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users2,
} from "lucide-react";

const stats = [
  { value: "500+", label: "Mutlu Aile", icon: Users2, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "2.400+", label: "Aktif İlan", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "10+", label: "Yıl Tecrübe", icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
  { value: "₺2M+", label: "İşlem Hacmi", icon: TrendingUp, color: "text-accent", bg: "bg-amber-50" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Güven & Şeffaflık",
    desc: "Her ilanı hukuki, teknik ve finansal açıdan titizlikle inceleyerek müşterilerimize tam şeffaflık sağlarız. Sürpriz maliyet, gizli kalem yok.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Sparkles,
    title: "Lüks Portföy",
    desc: "Seçkin konutlardan prestijli ticari alanlara kadar geniş ve özel bir portföy yelpazesiyle her bütçeye ve beklentiye hitap ederiz.",
    color: "text-accent",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Clock3,
    title: "7/24 Danışmanlık",
    desc: "İhtiyacınız olan her anda uzman danışman kadromuz yanınızda. Hızlı geri dönüş garantisi ve kesintisiz iletişim ilkesiyle çalışırız.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Globe2,
    title: "Ulusal Ağ",
    desc: "İstanbul, Ankara, İzmir başta olmak üzere 20+ şehirde aktif portföy ve saha danışmanlarımızla Türkiye genelinde hizmet veriyoruz.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: TrendingUp,
    title: "Yatırım Odaklı",
    desc: "Bölgesel piyasa analizleri, kira getirisi hesaplamaları ve değer artış projeksiyonlarıyla en verimli yatırım kararını almanıza destek oluruz.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: HeartHandshake,
    title: "Müşteri Memnuniyeti",
    desc: "İşlem sonrası destek, tapu devri takibi ve taşınma sürecinde de yanınızda olmaya devam eden tek adres olmaktan gurur duyuyoruz.",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
];

const team = [
  {
    name: "Ahmet Yılmaz",
    role: "Kurucu & CEO",
    bio: "15 yıllık gayrimenkul tecrübesiyle İstanbul pazarının en tanınan isimlerinden biri. GYODER üyesi, lisanslı değerleme uzmanı.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    badge: "CEO",
    badgeColor: "from-slate-700 to-slate-900",
  },
  {
    name: "Selin Kaya",
    role: "Satış Direktörü",
    bio: "10 yılda 800+ konut satışına imza atan Selin, premium segment müşteri ilişkileri konusunda sektörün referans noktasıdır.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    badge: "Satış",
    badgeColor: "from-blue-600 to-indigo-700",
  },
  {
    name: "Emre Demir",
    role: "Yatırım Danışmanı",
    bio: "Ticari gayrimenkul ve arsa yatırımlarında uzmanlaşmış Emre, portföylerini büyütmek isteyen yatırımcıların ilk tercihidir.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    badge: "Yatırım",
    badgeColor: "from-emerald-600 to-teal-700",
  },
];

const milestones = [
  { year: "2014", title: "Kuruluş", desc: "İstanbul Levent'te küçük ama iddialı bir ofis ve 3 kişilik ekiple yolculuğumuza başladık.", color: "border-blue-400", dot: "bg-blue-500" },
  { year: "2016", title: "İlk 100 Satış", desc: "İki yılda 100 konut satışını geride bırakarak İstanbul'un tanınan butik emlak markalarından biri olduk.", color: "border-emerald-400", dot: "bg-emerald-500" },
  { year: "2018", title: "Ankara Şubesi", desc: "Artan talep ve kurumsal müşteri portföyümüzün genişlemesiyle başkente açıldık.", color: "border-purple-400", dot: "bg-purple-500" },
  { year: "2020", title: "Dijital Dönüşüm", desc: "Sektörün ilk entegre online ilan ve danışmanlık platformunu hayata geçirerek dijital öncü olduk.", color: "border-amber-400", dot: "bg-amber-500" },
  { year: "2022", title: "İzmir Şubesi", desc: "Ege'nin gözde şehrine taşınarak üç büyük şehirde faaliyet gösteren ulusal bir marka haline geldik.", color: "border-rose-400", dot: "bg-rose-500" },
  { year: "2024", title: "₺2 Milyar Hacim", desc: "Toplam işlem hacmimiz 2 milyar TL'yi geçerek kurulduğumuzdan bu yana en güçlü yılımızı yaşadık.", color: "border-accent", dot: "bg-accent" },
];

const offices = [
  { city: "İstanbul", address: "Levent Mah. Büyükdere Cad. No:185, Şişli", phone: "+90 212 000 00 00" },
  { city: "Ankara", address: "Çankaya Mah. Atatürk Bulvarı No:98, Çankaya", phone: "+90 312 000 00 00" },
  { city: "İzmir", address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:64, Konak", phone: "+90 232 000 00 00" },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-12">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl premium-ring">
        <div className="relative min-h-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1800&auto=format&fit=crop"
            alt="Vera premium city skyline"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,175,55,0.12),transparent_60%)]" />
          {/* Floating orb */}
          <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-accent/8 blur-3xl animate-float" />
          <div className="absolute inset-0 flex items-center px-8 py-12 md:px-14">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                Vera Real Estate
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-6xl">
                Hakkımızda
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
                2014&apos;ten bu yana Türkiye&apos;nin premium gayrimenkul dünyasında güven, veri odaklı
                karar alma ve butik danışmanlık anlayışını bir arada sunan kurumsal bir markayız.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/properties" className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:brightness-110 active:scale-[0.98]">
                  Portföyü İncele <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-accent hover:bg-white/5 hover:text-accent">
                  Bize Ulaşın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ value, label, icon: Icon, color, bg }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-lg card-entrance`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`rounded-2xl ${bg} p-3`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </section>

      {/* ── VİZYON & MİSYON ── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-blue-100 bg-card p-8 shadow-sm transition hover:shadow-md">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Nereye Gidiyoruz</p>
            <h2 className="text-2xl font-bold text-foreground">Vizyonumuz</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Türkiye&apos;nin en seçici gayrimenkul portföyünü teknoloji destekli danışmanlık modeliyle
              buluşturarak her müşteriye ölçeklenebilir, güvenilir ve kişiselleştirilmiş bir deneyim sunmak.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-card p-8 shadow-sm transition hover:shadow-md">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-600">Neden Varız</p>
            <h2 className="text-2xl font-bold text-foreground">Misyonumuz</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Müşterilerimizin yaşam ve yatırım hedeflerini doğru analiz ederek; doğru lokasyon, doğru
              fiyat ve doğru zaman üçlüsünde en yüksek değeri üretmek ve kalıcı ilişkiler kurmak.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
            <div className="flex items-start gap-3">
              <Star className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-slate-700">
                <span className="font-semibold text-foreground">Temel İlkemiz:</span> Sadece ilan
                listelemiyor, her müşteriye özel yol haritası çiziyor, sürecin her adımında aktif
                danışmanlık yapıyoruz.
              </p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[480px] overflow-hidden rounded-2xl border border-border/60 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop"
            alt="Vera premium ofis"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md">
            <p className="text-sm font-semibold text-white">İstanbul · Ankara · İzmir</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Üç büyük şehirde konumlanan ofislerimiz ve 20+ danışmanımızla Türkiye&apos;nin dört bir
              yanında premium gayrimenkul hizmeti sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* ── DEĞERLERİMİZ ── */}
      <section>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Bizi Biz Yapan</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Değerlerimiz</h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
            Her kararımızın, her hizmetimizin ve her ilişkimizin arkasında duran altı temel ilke.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              className={`group rounded-2xl border ${v.border} bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-entrance`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`mb-5 inline-flex rounded-2xl ${v.bg} p-3.5`}>
                <v.icon className={`h-6 w-6 ${v.color}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground">{v.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TARİHÇE ── */}
      <section className="rounded-3xl bg-primary px-6 py-16 md:px-12 premium-ring">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">10 Yılın Hikayesi</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Nasıl Büyüdük?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            Küçük bir ofisten Türkiye&apos;nin önde gelen premium gayrimenkul markasına uzanan yolculuğumuz.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-white/10 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 top-4 z-10 md:left-1/2 md:-translate-x-1/2">
                  <div className={`h-4 w-4 rounded-full ${m.dot} ring-4 ring-primary shadow-lg`} />
                </div>

                {/* Content — mobile always left-padded */}
                <div className={`ml-20 flex-1 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                  <div
                    className={`inline-block rounded-2xl border ${m.color} border-opacity-30 bg-white/5 p-5 transition hover:bg-white/10`}
                  >
                    <p className={`mb-1 text-xs font-black uppercase tracking-widest text-accent`}>{m.year}</p>
                    <h3 className="text-base font-bold text-white">{m.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{m.desc}</p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EKİP ── */}
      <section>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Arkamızdaki İnsanlar</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ekibimiz</h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-500">
            Deneyimli, tutkulu ve müşteri odaklı danışman kadromuzla tanışın.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-2xl card-entrance"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className={`absolute right-4 top-4 rounded-full bg-gradient-to-r ${member.badgeColor} px-3 py-1 text-xs font-bold text-white shadow backdrop-blur-sm`}>
                  {member.badge}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OFİSLER ── */}
      <section>
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">Neredeyiz</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ofislerimiz</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {offices.map((o, i) => (
            <div
              key={o.city}
              className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm transition-all duration-200 hover:border-accent/30 hover:shadow-md hover-lift-sm card-entrance"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 inline-flex rounded-2xl bg-accent/10 p-3.5">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{o.city}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{o.address}</p>
              <a
                href={`tel:${o.phone.replace(/\s/g, "")}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-accent/80"
              >
                <Phone className="h-4 w-4" />
                {o.phone}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center md:px-10 premium-ring">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_65%)]" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Hemen Başlayın</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Hayalinizdeki Mülkü Birlikte Bulalım
          </h2>
          <p className="text-base leading-relaxed text-slate-300">
            Uzman danışman kadromuzla ücretsiz ön görüşme yapın.
            Size özel portföy analizi ve yatırım önerileri hazırlayalım.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-3 text-base font-bold text-slate-900 shadow-lg transition hover:brightness-110">
              Ücretsiz Danışmanlık Al <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/properties" className="inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-8 py-3 text-base font-semibold text-white transition hover:border-accent hover:bg-white/10 hover:text-accent">
              İlanları İncele
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
