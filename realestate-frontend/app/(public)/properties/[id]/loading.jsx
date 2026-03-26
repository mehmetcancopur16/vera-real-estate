import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailLoading() {
  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Gallery */}
      <div className="overflow-hidden rounded-3xl border border-border/60">
        <Skeleton className="h-[320px] w-full rounded-none md:h-[520px]" />
        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-3 md:grid-cols-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg md:h-20" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-7">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-8 w-3/5" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          {/* Description */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-7">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          {/* Amenities */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-7">
            <Skeleton className="h-5 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-xl" />
              ))}
            </div>
          </div>
          {/* Map */}
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
