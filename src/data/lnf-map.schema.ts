// src/data/lnf-map.schema.ts
export type SourceType = "trailer" | "dev-comment" | "leak" | "community" | "inferred";

export interface MapSourceRef {
  type: SourceType;
  ref: string;        // e.g. "Trailer 00:41", URL, Kommentar
}

export type MarkerCategory =
  | "biome"
  | "settlement"
  | "creature"
  | "structure"
  | "point-of-interest";

export interface MediaItem {
  id: string;                   // "snow-bridge-01"
  thumbUrl: string;             // small image
  fullUrl: string;              // large image
  caption?: string;             // "Snowy bridge from first trailer"
  timecode?: string;            // "00:41"
  source?: "trailer" | "screenshot" | "concept" | "community";
}

export interface MapMarker {
  id: string;                       // "snowy-peaks-bridge"
  title: string;                    // "Snowy mountain + stone bridge"
  category: MarkerCategory;
  position: [number, number];       // [x, y] image coords in px
  confidence: 0.2 | 0.4 | 0.6 | 0.8 | 1.0;
  sources: MapSourceRef[];
  notes?: string;
  tags?: string[];                  // lower-kebab-case: ["dead-trees","snow"]
  thumbUrl?: string;
  media?: MediaItem[];
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
  size: [number, number];           // [widthPx, heightPx]
  attributionHtml?: string;
}

export interface MapConfig {
  base: MapBaseImage;
  layers: MapLayer[];
  lastUpdatedISO: string;
  disclaimerHtml?: string;
  lang?: "en" | "de";
  video?: { youtubeId: string };    // centralized trailer ref for timestamps
}
