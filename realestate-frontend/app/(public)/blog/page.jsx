import Image from "next/image";
import Link from "next/link";

import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react";

const blogPosts = [
  {
    title: "2026 Emlak Trendleri",
    excerpt: "Konut, arsa ve ticari alanlarda 2026’yı şekillendiren fırsat alanları.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Konya’da Yatırım Yapmanın Avantajları",
    excerpt: "Bölgesel büyüme, ulaşım yatırımları ve doğru zamanlama ile değer yaratın.",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Lüks Satın Almada Doğru Strateji",
    excerpt: "Şeffaf süreç, doğru belge takibi ve yatırım hedefinize uygun kararlar.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-14 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.18),transparent_50%)]" />
        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-4 w-4" />
            Blog
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 md:text-5xl">Emlak Dünyasından Haberler</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Güncel piyasa yorumları, yatırım rehberleri ve lüks süreç detayları.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.title}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
            <div className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-xs font-medium text-accent">
                <MessageSquareText className="h-4 w-4" />
                Blog Yazısı
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
              <p className="text-sm text-slate-600">{post.excerpt}</p>
              <div className="pt-2">
                <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
                  Oku <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

