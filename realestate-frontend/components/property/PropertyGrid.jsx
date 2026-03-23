import PropertyCard from "@/components/property/PropertyCard";

export default function PropertyGrid({ properties }) {
  if (!properties?.length) {
    return <p className="text-sm text-muted-foreground">Gosterilecek ilan bulunamadi.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property._id || property.id} property={property} />
      ))}
    </div>
  );
}
