"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PropertyDetailError({ reset }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-red-200 bg-red-50/40 p-10 text-center">
      <div className="rounded-2xl bg-red-100 p-5">
        <AlertTriangle className="h-10 w-10 text-red-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">İlan Yüklenemedi</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Bağlantı veya sunucu kaynaklı geçici bir problem oluşmuş olabilir.
          Tekrar deneyebilir ya da ilan listesine dönebilirsiniz.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-6 py-2.5 text-sm font-bold text-slate-900 shadow hover:brightness-105"
        >
          <RefreshCw className="h-4 w-4" />
          Tekrar Dene
        </button>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          İlanlara Dön
        </Link>
      </div>
    </div>
  );
}
