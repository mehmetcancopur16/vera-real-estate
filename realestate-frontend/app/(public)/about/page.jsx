import Image from "next/image";
import { ArrowRight, Building2, Clock3, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 animate-in slide-in-from-bottom duration-700">
        <div className="relative min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1800&auto=format&fit=crop"
            alt="Vera premium city skyline"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-black/45" />
          <div className="absolute inset-0 flex items-end p-7 md:p-10">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-accent/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent backdrop-blur">
                Vera Real Estate
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Hakkimizda</h1>
              <p className="mt-3 text-sm text-slate-200 md:text-base">
                Vera Real Estate, premium gayrimenkul dunyasinda guven, veri odakli karar alma ve
                butik danismanlik anlayisini bir araya getiren kurumsal bir markadir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-in slide-in-from-bottom duration-700">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-2xl font-semibold text-slate-900">Vizyonumuz</h2>
            <p className="mt-2 text-sm text-slate-600">
              Turkiye&apos;nin en secici gayrimenkul portfoyunu teknoloji destekli danismanlik modeli ile
              bulusturarak, her musteriye olceklenebilir ve guvenilir bir deneyim sunmak.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <h2 className="text-2xl font-semibold text-slate-900">Misyonumuz</h2>
            <p className="mt-2 text-sm text-slate-600">
              Musterilerimizin yasam ve yatirim hedeflerini dogru analiz ederek; dogru lokasyon, dogru
              fiyat ve dogru zaman uclusunde en yuksek degeri uretmek.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-accent">
            Kurumsal Portfoyumuzu Inceleyin <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop"
            alt="Vera premium ofis"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/90">
              Istanbul, Ankara ve Izmir odakli premium portfoy agimizla hem oturum hem yatirim
              gayrimenkullerinde butunsel danismanlik sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      <section className="animate-in slide-in-from-bottom duration-700">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Neden Vera?</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="inline-flex rounded-full bg-slate-100 p-3">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Guven</h3>
            <p className="mt-2 text-sm text-slate-600">
              Her ilani hukuki, teknik ve finansal acidan inceleyerek seffaf bir satin alma sureci saglariz.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="inline-flex rounded-full bg-slate-100 p-3">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Luks Portfoy</h3>
            <p className="mt-2 text-sm text-slate-600">
              Seckin konutlardan prestijli ticari alanlara kadar genis ve ozel bir portfoy secenegi sunariz.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <div className="inline-flex rounded-full bg-slate-100 p-3">
              <Clock3 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">7/24 Danismanlik</h3>
            <p className="mt-2 text-sm text-slate-600">
              Ihtiyaciniz olan her anda uzman danisman kadromuzla surecinizi kesintisiz takip ederiz.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-primary p-7 md:p-8 animate-in slide-in-from-bottom duration-700">
        <div className="mb-6 flex items-center gap-2 text-white">
          <Building2 className="h-5 w-5 text-accent" />
          <h2 className="text-2xl font-semibold">Rakamlarla Vera</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-4xl font-bold text-white">500+</p>
            <p className="mt-2 text-sm text-slate-300">Mutlu Aile</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-4xl font-bold text-white">10+ Yil</p>
            <p className="mt-2 text-sm text-slate-300">Sektor Tecrubesi</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-4xl font-bold text-white">2 Milyar TL+</p>
            <p className="mt-2 text-sm text-slate-300">Satis Hacmi</p>
          </div>
        </div>
      </section>
    </div>
  );
}
