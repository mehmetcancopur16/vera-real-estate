import Image from "next/image";
import { Building2, Clock3, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-primary px-6 py-14 text-white animate-in slide-in-from-bottom duration-700">
        <h1 className="text-4xl font-semibold">Hakkimizda</h1>
        <p className="mt-3 max-w-3xl text-white/85">
          Vera Real Estate, luks emlak dunyasinda guven, seffaflik ve yuksek hizmet kalitesi ile
          fark yaratan kurumsal bir danismanlik markasidir.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-in slide-in-from-bottom duration-700">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Vizyonumuz</h2>
            <p className="mt-2 text-sm text-slate-600">
              Turkiye&apos;nin en secici gayrimenkul portfoyunu teknoloji destekli danismanlik modeli ile
              bulusturarak, her musteriye olceklenebilir ve guvenilir bir deneyim sunmak.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Misyonumuz</h2>
            <p className="mt-2 text-sm text-slate-600">
              Musterilerimizin yasam ve yatirim hedeflerini dogru analiz ederek; dogru lokasyon, dogru
              fiyat ve dogru zaman uclusunde en yuksek degeri uretmek.
            </p>
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop"
            alt="Vera premium ofis"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 text-sm text-white/90">
            Istanbul, Ankara ve Izmir odakli premium portfoy agimizla hem oturum hem yatirim
            gayrimenkullerinde butunsel danismanlik sunuyoruz.
          </p>
        </div>
      </section>

      <section className="animate-in slide-in-from-bottom duration-700">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Neden Vera?</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <ShieldCheck className="h-10 w-10 text-accent" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Guven</h3>
            <p className="mt-2 text-sm text-slate-600">
              Her ilani hukuki, teknik ve finansal acidan inceleyerek seffaf bir satin alma sureci saglariz.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Sparkles className="h-10 w-10 text-accent" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Luks Portfoy</h3>
            <p className="mt-2 text-sm text-slate-600">
              Seckin konutlardan prestijli ticari alanlara kadar genis ve ozel bir portfoy secenegi sunariz.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Clock3 className="h-10 w-10 text-accent" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">7/24 Danismanlik</h3>
            <p className="mt-2 text-sm text-slate-600">
              Ihtiyaciniz olan her anda uzman danisman kadromuzla surecinizi kesintisiz takip ederiz.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-3 animate-in slide-in-from-bottom duration-700">
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="text-4xl font-bold text-slate-900">500+</p>
          <p className="mt-2 text-sm text-slate-600">Mutlu Aile</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="text-4xl font-bold text-slate-900">10+ Yil</p>
          <p className="mt-2 text-sm text-slate-600">Sektor Tecrubesi</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <p className="text-4xl font-bold text-slate-900">₺2 Milyar+</p>
          <p className="mt-2 text-sm text-slate-600">Satis Hacmi</p>
        </div>
      </section>
    </div>
  );
}
