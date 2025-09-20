// src/components/LNFMap.tsx
import { useEffect, useMemo, useRef } from "react";
import type { MapConfig } from "../data/lnf-map.schema";

type Props = { config: MapConfig };

// kleine Hilfsfunktion für CSS-Lade-Injektion (einmalig)
function ensureLeafletCss() {
  if (typeof document === "undefined") return;
  const ID = "leaflet-css";
  if (document.getElementById(ID)) return;
  const link = document.createElement("link");
  link.id = ID;
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";
  document.head.appendChild(link);
}

// simpel escaper fürs Popup
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function LNFMap({ config }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const groupRefs = useRef<Record<string, any>>({});

  // Bounds im Simple-CRS: [ [y0,x0], [y1,x1] ]  == [ [0,0], [height,width] ]
  const bounds = useMemo(
    () => [[0, 0], [config.base.size[1], config.base.size[0]]] as [number, number][],
    [config.base.size]
  );

  useEffect(() => {
    // Nur im Browser
    if (typeof window === "undefined") return;
    if (!mapEl.current || mapRef.current) return;

    // CSS nachladen
    ensureLeafletCss();

    // Leaflet dynamisch importieren (verhindert SSR-Import von window)
    let L: any;
    let destroyed = false;

    (async () => {
      const mod = await import("leaflet"); // kein Top-Level-Import!
      if (destroyed) return;
      L = mod.default || mod;

      const map = L.map(mapEl.current!, {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomControl: true,
        attributionControl: false,
      });

      L.imageOverlay(config.base.imageUrl, bounds).addTo(map);
      map.fitBounds(bounds);
      mapRef.current = map;

      // Layer + Marker
      config.layers.forEach((layer) => {
        const lg = L.layerGroup();
        groupRefs.current[layer.id] = lg;

        layer.markers.forEach((m) => {
          const latlng = [m.position[1], m.position[0]];
          const marker = L.circleMarker(latlng, { radius: 6, weight: 1 });

          const popupHtml = `
            <div style="max-width:260px">
              <strong>${escapeHtml(m.title)}</strong><br/>
              <small>${escapeHtml(m.category)} · Confidence: ${m.confidence.toFixed(1)}</small><br/>
              ${m.notes ? `<div style="margin-top:6px">${escapeHtml(m.notes)}</div>` : ""}
              ${
                m.sources?.length
                  ? `<div style="margin-top:6px"><small>Sources: ${m.sources
                      .map((s) => escapeHtml(s.ref))
                      .join(", ")}</small></div>`
                  : ""
              }
            </div>
          `;

          marker.bindPopup(popupHtml, { maxWidth: 280 });
          marker.addTo(lg);
        });

        if (layer.visibleByDefault) lg.addTo(map);
      });
    })();

    return () => {
      destroyed = true;
      try {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      } catch {}
      mapRef.current = null;
      groupRefs.current = {};
    };
  }, [bounds, config]);

  return (
    <div>
      <div
        ref={mapEl}
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "var(--shadow-soft)",
          border: "1px solid color-mix(in oklab, var(--color-border), transparent 50%)",
        }}
      />
      {config.base.attributionHtml && (
        <p
          className="text-xs text-text2 mt-2"
          dangerouslySetInnerHTML={{ __html: config.base.attributionHtml }}
        />
      )}
    </div>
  );
}
