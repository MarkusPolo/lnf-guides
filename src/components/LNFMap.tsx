// src/components/LNFMap.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { MapConfig, MapMarker, MediaItem, MapLayer } from "../data/lnf-map.schema";

type Props = { config: MapConfig };

// Leaflet CSS only in browser
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
  const parts = tc.split(":").map((x) => parseInt(x, 10));
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

// marker color per category (stroke/fill)
const COLOR_BY_CAT: Record<string, { color: string; fill: string }> = {
  biome: { color: "#2DD4BF", fill: "#2DD4BF" },       // teal
  structure: { color: "#F59E0B", fill: "#F59E0B" },   // amber
  settlement: { color: "#F59E0B", fill: "#F59E0B" },  // amber
  creature: { color: "#A78BFA", fill: "#A78BFA" },    // violet
  "point-of-interest": { color: "#60A5FA", fill: "#60A5FA" }, // blue
};

export default function LNFMap({ config }: Props) {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const Lref = useRef<any>(null);

  // UI state
  const [enabledLayers, setEnabledLayers] = useState<Record<string, boolean>>(() => {
    const obj: Record<string, boolean> = {};
    config.layers.forEach((l) => (obj[l.id] = !!l.visibleByDefault));
    return obj;
  });
  const [minConfidence, setMinConfidence] = useState<0.2 | 0.4 | 0.6 | 0.8 | 1.0>(0.2);
  const [tagQuery, setTagQuery] = useState<string>("");

  // Lightbox
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const bounds = useMemo(
    () => [[0, 0], [config.base.size[1], config.base.size[0]]] as [number, number][],
    [config.base.size]
  );

  // Prepare filters
  const tagTokens = useMemo(() => {
    return tagQuery
      .toLowerCase()
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagQuery]);

  const layerGroupsRef = useRef<Record<string, any>>({});

  const applyFilters = useCallback(
    (layer: MapLayer, L: any) => {
      const lg = layerGroupsRef.current[layer.id];
      if (!lg) return;

      // Clear old children
      lg.clearLayers();

      const ytid = config.video?.youtubeId;

      layer.markers.forEach((m) => {
        if (m.confidence < minConfidence) return;

        // tag filter: match if every token present in tags OR in title
        const title = (m.title || "").toLowerCase();
        const tags = (m.tags || []).map((t) => t.toLowerCase());
        const tagOk =
          tagTokens.length === 0 ||
          tagTokens.every((tok) => title.includes(tok) || tags.includes(tok));

        if (!tagOk) return;

        const latlng = [m.position[1], m.position[0]];

        const col = COLOR_BY_CAT[m.category] || COLOR_BY_CAT["point-of-interest"];
        const radius = 4 + Math.round(m.confidence * 6); // 5..10

        const marker = L.circleMarker(latlng, {
          radius,
          weight: 2,
          color: col.color,
          fillColor: col.fill,
          fillOpacity: 0.6,
          // a11y: marker ist fokussierbar
          keyboard: true,
        });

        // --- TOOLTIP (on hover) ---
        // Kompakt: Titel, Kategorie/Confidence, optional Mini-Thumb
        const mini =
          m.thumbUrl
            ? `<img src="${escapeHtml(m.thumbUrl)}" alt="" width="80" height="48" style="width:80px;height:auto;border-radius:6px;display:block;margin:6px 0 0"/>`
            : "";

        const tooltipHtml = `
          <div class="lnf-tip">
            <strong>${escapeHtml(m.title)}</strong><br/>
            <small>${escapeHtml(m.category)} · ${m.confidence.toFixed(1)}</small>
            ${mini}
          </div>
        `;
        marker.bindTooltip(tooltipHtml, {
          direction: "top",
          className: "lnf-tooltip",
          opacity: 1,
          sticky: true, // folgt dem Cursor leicht
        });

        // --- CLICK => Lightbox ---
        marker.on("click", () => {
          if (m.media?.length) {
            setActiveMarker(m);
            setActiveIndex(0);
          } else {
            // Keine Media? Falls doch ein Timestamp-Link vorhanden wäre, könnte man hier deeplinken:
            const first = m.media?.[0];
            const t = first?.timecode ? secondsFromTimecode(first.timecode) : 0;
            if (ytid && t > 0) {
              window.open(`https://www.youtube.com/watch?v=${ytid}&t=${t}s`, "_blank", "noopener");
            }
          }
        });

        // Enter/Space öffnet Lightbox (Keyboard)
        marker.on("keypress", (e: any) => {
          if (e.originalEvent?.key === "Enter" || e.originalEvent?.key === " ") {
            setActiveMarker(m);
            setActiveIndex(0);
          }
        });

        marker.addTo(lg);
      });
    },
    [minConfidence, tagTokens, config.video?.youtubeId]
  );

  // init map
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapEl.current || mapRef.current) return;

    ensureLeafletCss();

    let destroyed = false;

    (async () => {
      const mod = await import("leaflet");
      if (destroyed) return;
      const L = mod.default || mod;
      Lref.current = L;

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

      // create layer groups
      config.layers.forEach((layer) => {
        const lg = L.layerGroup();
        layerGroupsRef.current[layer.id] = lg;
        if (enabledLayers[layer.id]) lg.addTo(map);
        // initial fill with filters
        applyFilters(layer, L);
      });
    })();

    return () => {
      destroyed = true;
      try {
        if (mapRef.current) mapRef.current.remove();
      } catch {}
      mapRef.current = null;
      layerGroupsRef.current = {};
      Lref.current = null;
    };
  }, []); // eslint-disable-line

  // re-apply filters when minConfidence/tagQuery change
  useEffect(() => {
    const L = Lref.current;
    if (!L) return;
    config.layers.forEach((layer) => applyFilters(layer, L));
  }, [minConfidence, tagTokens, config.layers, applyFilters]);

  // toggle layers on/off
  const toggleLayer = (id: string, on: boolean) => {
    setEnabledLayers((prev) => ({ ...prev, [id]: on }));
    const map = mapRef.current;
    const lg = layerGroupsRef.current[id];
    if (!map || !lg) return;
    if (on) lg.addTo(map);
    else map.removeLayer(lg);
  };

  // Lightbox helpers
  const closeLightbox = useCallback(() => {
    setActiveMarker(null);
    setActiveIndex(0);
  }, []);

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

  const media = activeMarker?.media ?? [];
  const current: MediaItem | undefined = media[activeIndex];
  const ytid = config.video?.youtubeId;
  const tsHref =
    ytid && current?.timecode
      ? `https://www.youtube.com/watch?v=${ytid}&t=${secondsFromTimecode(current.timecode)}s`
      : undefined;

  return (
    <div>
      {/* Controls */}
      <div className="mb-3 grid gap-3 md:grid-cols-3">
        <div className="card p-3">
          <div className="text-sm font-semibold mb-2">Layers</div>
          <div className="flex flex-wrap gap-3">
            {config.layers.map((l) => (
              <label key={l.id} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!enabledLayers[l.id]}
                  onChange={(e) => toggleLayer(l.id, e.currentTarget.checked)}
                />
                <span>{l.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-3">
          <div className="text-sm font-semibold mb-2">Minimum confidence</div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0.2}
              max={1.0}
              step={0.2}
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.currentTarget.value) as any)}
              className="w-full"
            />
            <div className="w-14 text-right text-sm">{minConfidence.toFixed(1)}</div>
          </div>
        </div>

        <div className="card p-3">
          <div className="text-sm font-semibold mb-2">Tag search</div>
          <input
            type="text"
            placeholder="e.g. snow, dead-trees"
            value={tagQuery}
            onChange={(e) => setTagQuery(e.currentTarget.value)}
            className="w-full rounded px-3 py-2 bg-bg border border-border"
            aria-label="Filter markers by tags"
          />
          <p className="text-xs text-text2 mt-2">Use commas or spaces. Matches tags or title.</p>
        </div>
      </div>

      {/* Map canvas */}
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

      {/* Lightbox */}
      {activeMarker && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="w-full max-w-5xl bg-surface border border-border rounded-2xl shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">{activeMarker.title}</h3>
                <p className="text-xs text-text2">
                  {activeMarker.category} · Confidence {activeMarker.confidence.toFixed(1)}
                </p>
              </div>
              <button className="btn btn-outline" onClick={closeLightbox} type="button" aria-label="Close gallery">
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr,240px] p-4">
              <div className="relative">
                {current ? (
                  <div className="relative">
                    <img
                      src={current.fullUrl}
                      alt={current.caption ?? activeMarker.title}
                      className="w-full h-auto rounded-lg"
                      loading="eager"
                    />
                    {media.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-outline"
                          onClick={() => setActiveIndex((i) => (i - 1 + media.length) % media.length)}
                          type="button"
                          aria-label="Previous image"
                        >
                          ◀
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-outline"
                          onClick={() => setActiveIndex((i) => (i + 1) % media.length)}
                          type="button"
                          aria-label="Next image"
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

                {current && (
                  <div className="mt-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-text">{current.caption || ""}</p>
                      {ytid && current.timecode && (
                        <a
                          className="btn btn-outline"
                          href={`https://www.youtube.com/watch?v=${ytid}&t=${secondsFromTimecode(current.timecode)}s`}
                          target="_blank"
                          rel="noopener noreferrer"
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
                        <img src={m.thumbUrl} alt={m.caption ?? ""} className="w-full h-auto" loading="lazy" />
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
