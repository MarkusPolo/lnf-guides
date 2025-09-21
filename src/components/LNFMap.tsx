// src/components/LNFMap.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { MapConfig, MapMarker, MediaItem } from "../data/lnf-map.schema";

type Props = { config: MapConfig };

// CSS for Leaflet injected once on client
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

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function secondsFromTimecode(tc?: string) {
  if (!tc) return 0;
  const m = tc.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return 0;
  const h = parseInt(m[3] ? m[1] : "0", 10);
  const mm = parseInt(m[3] ? m[2] : m[1], 10);
  const ss = parseInt(m[3] ? m[3] : m[2], 10);
  return h * 3600 + mm * 60 + ss;
}

export default function LNFMap({ config }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const groupRefs = useRef<Record<string, any>>({});
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const bounds = useMemo(
    () => [[0, 0], [config.base.size[1], config.base.size[0]]] as [number, number][],
    [config.base.size]
  );

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setActiveMarker(null);
    setActiveIndex(0);
  }, []);

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!activeMarker) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (!activeMarker.media || activeMarker.media.length === 0) return;
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % activeMarker.media!.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + activeMarker.media!.length) % activeMarker.media!.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeMarker, closeLightbox]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapEl.current || mapRef.current) return;

    ensureLeafletCss();

    let L: any;
    let destroyed = false;

    (async () => {
      const mod = await import("leaflet");
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

      // Build layers
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
              ${m.media?.length ? `<div style="margin-top:6px"><em>Click marker for gallery…</em></div>` : ""}
            </div>
          `;
          marker.bindPopup(popupHtml, { maxWidth: 280 });

          // Lightbox on click
          marker.on("click", () => {
            setActiveMarker(m);
            setActiveIndex(0);
          });

          marker.addTo(lg);
        });

        if (layer.visibleByDefault) lg.addTo(map);
      });
    })();

    return () => {
      destroyed = true;
      try {
        if (mapRef.current) mapRef.current.remove();
      } catch {}
      mapRef.current = null;
      groupRefs.current = {};
    };
  }, [bounds, config]);

  // Lightbox UI
  const media = activeMarker?.media ?? [];
  const current: MediaItem | undefined = media[activeIndex];

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

      {/* Lightbox overlay */}
      {activeMarker && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // click on backdrop closes
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="w-full max-w-5xl bg-surface border border-border rounded-2xl shadow-soft overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">{activeMarker.title}</h3>
                <p className="text-xs text-text2">
                  {activeMarker.category} · Confidence {activeMarker.confidence.toFixed(1)}
                </p>
              </div>
              <button
                className="btn btn-outline"
                onClick={closeLightbox}
                aria-label="Close gallery"
                type="button"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="grid gap-4 md:grid-cols-[1fr,240px] p-4">
              {/* Main image / carousel */}
              <div className="relative">
                {current ? (
                  <div className="relative">
                    <img
                      src={current.fullUrl}
                      alt={current.caption ?? activeMarker.title}
                      className="w-full h-auto rounded-lg"
                      loading="eager"
                    />
                    {/* Prev/Next */}
                    {media.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-outline"
                          onClick={() =>
                            setActiveIndex((i) => (i - 1 + media.length) % media.length)
                          }
                          aria-label="Previous image"
                          type="button"
                        >
                          ◀
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-outline"
                          onClick={() => setActiveIndex((i) => (i + 1) % media.length)}
                          aria-label="Next image"
                          type="button"
                        >
                          ▶
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video grid place-items-center text-text2">
                    No media yet for this marker.
                  </div>
                )}

                {/* Caption + timestamp link */}
                {current && (
                  <div className="mt-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-text">{current.caption || ""}</p>
                      {current.timecode && (
                        <a
                          className="btn btn-outline"
                          href={`https://www.youtube.com/watch?v=jKQem4Z6ioQ&t=${secondsFromTimecode(current.timecode)}s`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open timestamp on YouTube"
                        >
                          Open at {current.timecode}
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-text2 mt-1">
                      Sources: {activeMarker.sources.map((s) => s.ref).join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnails / details */}
              <aside>
                {media.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {media.map((m, idx) => (
                      <button
                        key={m.id}
                        className={`relative rounded-lg overflow-hidden border ${idx === activeIndex ? "border-accent" : "border-border"}`}
                        onClick={() => setActiveIndex(idx)}
                        type="button"
                        aria-label={`Open image ${idx + 1}`}
                      >
                        <img src={m.thumbUrl} alt={m.caption ?? ""} className="w-full h-auto" />
                        {m.timecode && (
                          <span className="absolute bottom-1 right-1 text-[11px] bg-bg/70 px-1 rounded">
                            {m.timecode}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text2">Add trailer stills here to enhance this marker.</p>
                )}

                {activeMarker.notes && (
                  <div className="mt-4 text-sm">
                    <h4 className="font-semibold mb-1">Notes</h4>
                    <p className="text-text2">{activeMarker.notes}</p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
