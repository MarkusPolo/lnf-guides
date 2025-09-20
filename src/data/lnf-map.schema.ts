// src/data/lnf-map.schema.ts
export type SourceType = "trailer" | "dev-comment" | "leak" | "community" | "inferred";

export interface MapSourceRef {
  type: SourceType;
  ref: string;        // e.g. "Trailer 00:41", URL-Slug, Kommentar
}

export type MarkerCategory =
  | "biome"
  | "settlement"
  | "creature"
  | "structure"
  | "point-of-interest";

export interface MapMarker {
  id: string;                       // stable ID: "snowy-peaks-bridge"
  title: string;                    // "Snowy mountain + stone bridge"
  category: MarkerCategory;
  position: [number, number];       // [x, y] in image coords (px)
  confidence: 0.2 | 0.4 | 0.6 | 0.8 | 1.0;
  sources: MapSourceRef[];
  notes?: string;
  tags?: string[];
  // optional kleines Bild (Thumbnail) – z. B. aus Trailer-Standbild (Fair Use, klein!)
  thumbUrl?: string;
}

export interface MapLayer {
  id: string;                       // "biomes"
  title: string;                    // "Biomes spotted in trailer"
  description?: string;
  visibleByDefault: boolean;
  markers: MapMarker[];
}

export interface MapBaseImage {
  imageUrl: string;                 // /images/lnf/lnf-speculative-world.png
  size: [number, number];           // [widthPx, heightPx], e.g. [4096, 2048]
  attributionHtml?: string;
}

export interface MapConfig {
  base: MapBaseImage;
  layers: MapLayer[];
  lastUpdatedISO: string;           // for changelog/SEO
  disclaimerHtml?: string;          // displayed under/over the map
}
