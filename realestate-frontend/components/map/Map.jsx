"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ properties }) {
  const fallbackCenter = [39.9255, 32.8663];
  const first = properties?.find((p) => p.coordinates);
  const center = first ? [first.coordinates.lat, first.coordinates.lng] : fallbackCenter;

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-border">
      <MapContainer center={center} zoom={6} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties?.map((property) => {
          if (!property.coordinates) return null;
          return (
            <Marker
              key={property.id}
              icon={defaultIcon}
              position={[property.coordinates.lat, property.coordinates.lng]}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {property.location?.city} / {property.location?.district}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
