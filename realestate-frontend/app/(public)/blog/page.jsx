import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Calendar, Sparkles } from "lucide-react";

const AUTHOR = "Vera Editör Ekibi";

const categories = [
  {
    title: "Yatırım Rehberi",
    items: [
      {
        title: "Konya’da Yatırım Yapmanın Avantajları",
        date: "12 Mart 2026",
        excerpt: "Bölgesel büyüme, ulaşım yatırımları ve doğru zamanlama ile değer yaratın.",
        image:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Fiyat Analizi: Satın Alma mı Kiralama mı?",
        date: "05 Mart 2026",
        excerpt: "Yaşam hedeflerinize göre bütçe stratejisi oluşturmanın pratik yolları.",
        image:
          "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Tapu ve Süreç Kontrol Listesi",
        date: "26 Şubat 2026",
        excerpt: "Satın alma sürecinde dikkat edilmesi gereken belgeler ve kritik adımlar.",
        image:
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1400&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Lüks Yaşam",
    items: [
      {
        title: "Lüks Satın Almada Doğru Strateji",
        date: "18 Mart 2026",
        excerpt: "Seçkin portföylerde doğru karar için şeffaflık, analiz ve danışmanlık uyumu.",
        image:
          "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Manzara, Işık, Plan: Değerin 3 Anahtarı",
        date: "08 Mart 2026",
        excerpt: "Premium gayrimenkulde değer algısını belirleyen kritik detaylar ve pratik öneriler.",
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Butik Site Yaşamı: Artıları ve Eksileri",
        date: "22 Şubat 2026",
        excerpt: "Güvenlik, sosyal alanlar ve aidat dengesi için karar rehberi.",
        image:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Emlak Trendleri",
    items: [
      {
        title: "2026 Emlak Trendleri",
        date: "20 Mart 2026",
        excerpt: "Konut, arsa ve ticari alanlarda 2026’yı şekillendiren fırsat alanları.",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Sürdürülebilir Yapılar ve Enerji Verimliliği",
        date: "02 Mart 2026",
        excerpt: "Yeni nesil projelerde enerji tasarrufu ve uzun vadeli değer artışı.",
        image:
          "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1400&auto=format&fit=crop",
      },
      {
        title: "Ticari Gayrimenkulde Risk Yönetimi",
        date: "14 Şubat 2026",
        excerpt: "Lokasyon, kira potansiyeli ve sözleşme yönetimiyle daha sağlam yatırım.",
        image:
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop",
      },
    ],
  },
];

function BlogCard({ category, post }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 text-xs font-semibold text-primary-foreground">
          {category}
        </span>
      </div>
      <div className="space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4 text-accent" />
            {post.date}
          </span>
          <span className="text-slate-400">•</span>
          <span>{AUTHOR}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>

        <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
          Devamını Oku <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default function BlogPage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border border-border/80 premium-ring">
        <div className="relative h-[360px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1800&auto=format&fit=crop"
            alt="Vera Blog"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/65" />
          <div className="absolute inset-0 flex items-end p-7 md:p-10">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-4 w-4" />
                Vera Insights
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
                Emlak Dünyasından Haberler ve Yatırım Rehberi
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                Trend raporları, yatırım stratejileri ve premium yaşamı büyüten ipuçları.
              </p>
            </div>
          </div>
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat.title} className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-accent" />
            <h2 className="text-2xl font-semibold text-slate-900">{cat.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {cat.items.map((post) => (
              <BlogCard key={post.title} category={cat.title} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

