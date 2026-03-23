"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center rounded-xl border border-border text-sm text-muted-foreground">
      Harita yukleniyor...
    </div>
  ),
});

export default function MapView({ properties }) {
  return <DynamicMap properties={properties} />;
}
