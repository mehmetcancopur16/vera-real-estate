import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Tag,
  Bell,
} from "lucide-react";
import { AUTHOR, BLOG_POSTS, CATEGORIES, FEATURED_POSTS } from "@/lib/blog-data";

const CATEGORY_ICONS = {
  "Piyasa Analizi": TrendingUp,
  "Yatırım": Tag,
  "Yaşam": BookOpen,
};

function FeaturedHeroCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-border/60 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-accent/10"
    >
      <div className="relative h-[420px] w-full md:h-[500px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${post.categoryColor} px-3 py-1.5 text-xs font-bold text-white shadow-lg`}>
              <TrendingUp className="h-3 w-3" />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-accent" />
              Öne Çıkan
            </span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-lg md:text-4xl">
            {post.title}
          </h2>

          <p className="line-clamp-2 text-sm leading-relaxed text-slate-300 md:text-base">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              {post.readTime}
            </span>
            <span className="text-slate-500">·</span>
            <span>{AUTHOR}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 group-hover:bg-accent group-hover:text-slate-900">
            Makaleyi Oku
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ post, index = 0 }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/20 hover:shadow-xl card-entrance"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/blog/${post.slug}`} className="relative block overflow-hidden">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-107"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
          {/* Hover shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 transition-all duration-500 group-hover:from-white/5 group-hover:via-white/0 group-hover:to-white/0" />
        </div>
        <span className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${post.categoryColor} px-3 py-1 text-xs font-bold text-white shadow-md`}>
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            {post.date}
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-accent" />
            {post.readTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-accent">
            {post.title}
          </h3>
        </Link>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-amber-400/20 text-[10px] font-black text-accent">
              VE
            </div>
            <span className="text-xs text-slate-500">{AUTHOR}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent transition-all duration-200 hover:gap-2.5"
          >
            Devamını Oku
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const featuredPost = FEATURED_POSTS[0];
  const secondaryFeatured = FEATURED_POSTS.slice(1, 3);

  return (
    <div className="space-y-16 pb-12">

      {/* ── PAGE HEADER ── */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl md:p-12">
        {/* Animated background blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl animate-float-delayed" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-purple-500/8 blur-2xl animate-float" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Vera Insights
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
            Emlak Dünyasından{" "}
            <span className="gradient-text-shimmer">Haberler</span>{" "}
            ve Yatırım Rehberi
          </h1>
          <p className="mt-4 text-base text-slate-300 md:text-lg">
            Trend raporları, yatırım stratejileri ve premium yaşamı büyüten ipuçları. Uzman analizlerle gayrimenkul kararlarınızı güçlendirin.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <BookOpen className="h-3 w-3 text-accent" />
              {BLOG_POSTS.length} Makale
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <TrendingUp className="h-3 w-3 text-accent" />
              {CATEGORIES.length} Kategori
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Bell className="h-3 w-3 text-accent" />
              Haftalık Güncelleme
            </span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES STRIP ── */}
      <section className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent">
          <Sparkles className="h-3 w-3" />
          Tümü
        </span>
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Tag;
          return (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-accent/40 hover:bg-accent/5 hover:text-accent cursor-pointer"
            >
              <Icon className="h-3 w-3" />
              {cat}
            </span>
          );
        })}
      </section>

      {/* ── FEATURED HERO ── */}
      {featuredPost && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Editörün Seçimi</p>
          </div>
          <FeaturedHeroCard post={featuredPost} />
        </section>
      )}

      {/* ── SECONDARY FEATURED ── */}
      {secondaryFeatured.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <h2 className="text-xl font-bold text-foreground">Öne Çıkan Makaleler</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {secondaryFeatured.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── ALL POSTS BY CATEGORY ── */}
      {CATEGORIES.map((cat) => {
        const posts = BLOG_POSTS.filter((p) => p.category === cat);
        const CatIcon = CATEGORY_ICONS[cat] || Tag;
        return (
          <section key={cat} className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <span className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-1.5 shadow-sm">
                  <CatIcon className="h-4 w-4 text-accent" />
                  <h2 className="text-base font-bold text-foreground">{cat}</h2>
                </span>
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                  {posts.length} makale
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </section>
        );
      })}

      {/* ── NEWSLETTER CTA ── */}
      <section className="relative overflow-hidden rounded-3xl border border-accent/20 shadow-xl">
        {/* Glass background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl animate-float-delayed" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        <div className="relative p-8 text-center md:p-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-accent">
            <Bell className="h-3.5 w-3.5" />
            Bültene Katıl
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Piyasa Haberlerini Kaçırma
          </h2>
          <p className="mt-3 mx-auto max-w-md text-base text-slate-400">
            Her hafta seçilmiş emlak analizleri, yatırım fırsatları ve piyasa değerlendirmeleri doğrudan gelen kutuna gelsin.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:brightness-105 hover:-translate-y-0.5"
          >
            Ücretsiz Abone Ol
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
