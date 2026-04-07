import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Lightbulb,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AUTHOR, BLOG_POSTS, getPostBySlug } from "@/lib/blog-data";
import ShareButton from "@/components/property/ShareButton";

/* ── Metadata ── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Makale Bulunamadı | Vera Blog" };
  return {
    title: `${post.title} | Vera Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

/* ── Prose block ── */
function ProseSection({ title, body }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <span className="h-5 w-1 rounded-full bg-accent" />
        {title}
      </h3>
      <p className="leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

/* ── Tip item ── */
function TipItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
        <CheckCircle2 className="h-3 w-3 text-accent" />
      </span>
      <span className="text-sm text-slate-600">{text}</span>
    </li>
  );
}

/* ── Related post card ── */
function RelatedCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-md"
    >
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="96px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 space-y-1">
        <span
          className={`inline-block rounded-full bg-gradient-to-r ${post.categoryColor} px-2 py-0.5 text-[10px] font-bold text-white`}
        >
          {post.category}
        </span>
        <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </p>
        <p className="text-xs text-slate-500">{post.readTime}</p>
      </div>
    </Link>
  );
}

/* ── Page ── */
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 3);

  const otherRelated =
    related.length < 3
      ? BLOG_POSTS.filter(
          (p) => p.slug !== post.slug && p.category !== post.category
        ).slice(0, 3 - related.length)
      : [];

  const relatedPosts = [...related, ...otherRelated];

  return (
    <div className="space-y-8 pb-16">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-accent">Ana Sayfa</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/blog" className="transition hover:text-accent">Blog</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="max-w-[200px] truncate font-medium text-foreground">{post.title}</span>
      </nav>

      {/* ── HERO IMAGE ── */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
        <div className="relative h-[300px] w-full md:h-[480px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${post.categoryColor} px-3 py-1.5 text-xs font-bold text-white shadow`}
              >
                <TrendingUp className="h-3 w-3" />
                {post.category}
              </span>
              {post.featured && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 text-accent" />
                  Öne Çıkan
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold leading-tight text-white drop-shadow-lg md:text-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-accent" />
                {AUTHOR}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">

        {/* Article body */}
        <div className="space-y-6">

          {/* Intro card */}
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-amber-50/50 p-6 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
            <p className="relative text-base leading-relaxed text-slate-700">
              {post.content.intro}
            </p>
          </div>

          {/* Article sections */}
          <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
              <span className="h-px w-8 bg-accent" />
              İçerik
            </h2>
            <div className="space-y-8">
              {post.content.sections.map((section, idx) => (
                <ProseSection key={idx} title={section.title} body={section.body} />
              ))}
            </div>
          </div>

          {/* Tips callout */}
          {post.content.tips?.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow">
                  <Lightbulb className="h-4 w-4 text-white" />
                </span>
                <h3 className="font-bold text-amber-900">Pratik İpuçları</h3>
              </div>
              <ul className="space-y-2.5">
                {post.content.tips.map((tip, idx) => (
                  <TipItem key={idx} text={tip} />
                ))}
              </ul>
            </div>
          )}

          {/* Conclusion */}
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
              <span className="h-px w-8 bg-accent" />
              Sonuç
            </h2>
            <p className="leading-relaxed text-slate-600">{post.content.conclusion}</p>
          </div>

          {/* Share & back */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-accent hover:bg-accent/5 hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Blog&apos;a Dön
            </Link>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">Makaleyi paylaş:</p>
              <ShareButton title={post.title} text={post.excerpt} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">

          {/* Author card */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Yazar</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/30 to-amber-400/20 text-sm font-black text-accent ring-1 ring-accent/30">
                  VE
                </div>
                <div>
                  <p className="font-bold text-foreground">{AUTHOR}</p>
                  <p className="text-xs text-slate-500">Gayrimenkul Uzmanı</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Vera editör ekibi, Türkiye&apos;nin önde gelen gayrimenkul uzmanlarından oluşur.
              </p>
            </div>
          </div>

          {/* Category info */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div
              className={`bg-gradient-to-r ${post.categoryColor} px-5 py-4`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/80">Kategori</p>
              <p className="mt-1 font-extrabold text-white">{post.category}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500">
                {BLOG_POSTS.filter((p) => p.category === post.category).length} makale bu kategoride
              </p>
              <Link
                href="/blog"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs font-semibold text-slate-600 transition hover:border-accent hover:bg-accent/5 hover:text-accent"
              >
                Tüm Yazılar
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Trust / CTA */}
          <div className="overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <Sparkles className="mb-3 h-7 w-7 text-accent" />
            <p className="font-extrabold">Ücretsiz Danışmanlık</p>
            <p className="mt-1 text-xs text-slate-400">
              Gayrimenkul kararlarınızda uzman desteği alın.
            </p>
            <Link
              href="/contact"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient py-2.5 text-sm font-bold text-slate-900 transition hover:brightness-105"
            >
              İletişime Geç
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>

      {/* ── RELATED POSTS ── */}
      {relatedPosts.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <h2 className="text-xl font-bold text-foreground">İlgili Makaleler</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {relatedPosts.map((p) => (
              <RelatedCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
