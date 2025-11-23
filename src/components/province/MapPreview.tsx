import { useMemo } from "react";
import type { Shelter } from "@/types";

interface Props {
  shelter: Shelter;
}

export default function MapPreview({ shelter }: Props) {
  const bbox = useMemo(() => {
    const delta = 0.01; // ~1km radius
    const south = shelter.lat - delta;
    const north = shelter.lat + delta;
    const west = shelter.lng - delta;
    const east = shelter.lng + delta;
    return { south, north, west, east };
  }, [shelter.lat, shelter.lng]);

  const mapSrc = useMemo(() => {
    const { west, south, east, north } = bbox;
    const params = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
      layer: "mapnik",
    });
    return `https://www.openstreetmap.org/export/embed.html?${params.toString()}#map=15/${shelter.lat}/${shelter.lng}`;
  }, [bbox, shelter.lat, shelter.lng]);

  const externalLink = useMemo(
    () => `https://www.openstreetmap.org/?mlat=${shelter.lat}&mlon=${shelter.lng}#map=16/${shelter.lat}/${shelter.lng}`,
    [shelter.lat, shelter.lng]
  );

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white">
      <iframe
        title={`Bản đồ - ${shelter.name}`}
        src={mapSrc}
        className="h-48 w-full overflow-hidden rounded-b-lg"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-600">
        <span>Hiển thị với OpenStreetMap (không cần API key)</span>
        <a
          href={externalLink}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-brand-600 hover:underline"
        >
          Mở bản đồ
        </a>
      </div>
    </div>
  );
}
