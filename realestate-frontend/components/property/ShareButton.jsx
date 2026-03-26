"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: title || "Vera Real Estate İlan", text: text || "", url });
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard not available */
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/35 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/55"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-300" />
          Kopyalandı!
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          Paylaş
        </>
      )}
    </button>
  );
}
