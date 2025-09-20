// src/data/lnf-map.data.ts
import type { MapConfig } from "./lnf-map.schema";

export const LNF_MAP: MapConfig = {
  base: {
    imageUrl: "/images/int_map/lnf-speculative-world.webp",
    size: [4096, 2048],
    attributionHtml:
      'Speculative pre-release map • Unofficial fan work • Assets © respective owners',
  },
  lastUpdatedISO: "2025-09-20T09:00:00Z",
  disclaimerHtml:
    'This is a <strong>speculative, pre-release</strong> map built from trailer analysis and public info. Locations are illustrative, not final.',
  layers: [
    {
      id: "biomes",
      title: "Biomes spotted in trailer",
      visibleByDefault: true,
      markers: [
        {
          id: "snowy-peaks-bridge",
          title: "Snowy mountain + stone bridge",
          category: "structure",
          position: [2100, 420],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:41" }],
          notes: "High-altitude scene with snow; possible ruins/bridge.",
          tags: ["snow", "mountain", "bridge"],
        },
        {
          id: "lush-forest-river",
          title: "Lush forest & river bend",
          category: "biome",
          position: [1800, 980],
          confidence: 0.4,
          sources: [{ type: "trailer", ref: "Trailer 01:07" }],
          notes: "Dense greenery near a curving river; likely temperate biome.",
          tags: ["forest", "river"],
        },
      ],
    },
    {
      id: "creatures",
      title: "Creatures & Mounts",
      visibleByDefault: true,
      markers: [
        {
          id: "dragon-flight",
          title: "Dragon flight scene",
          category: "creature",
          position: [3150, 900],
          confidence: 0.4,
          sources: [{ type: "trailer", ref: "Trailer 02:15" }],
          notes: "Speculative: mountable dragons.",
          tags: ["dragon", "flight", "mount"],
        },
        {
          id: "ride-wild-beast",
          title: "Riding a wild beast",
          category: "creature",
          position: [2600, 1100],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 01:49" }],
          notes: "Player riding quadruped across plains.",
          tags: ["mount", "plains"],
        },
      ],
    },
    {
      id: "structures",
      title: "Structures & Settlements",
      visibleByDefault: true,
      markers: [
        {
          id: "coastal-ruins",
          title: "Coastal ruins / lighthouse-like",
          category: "structure",
          position: [3600, 600],
          confidence: 0.4,
          sources: [{ type: "trailer", ref: "Trailer 00:55" }],
          notes: "Sea-facing tower/ruins; could be player-made in-game.",
          tags: ["coast", "ruin", "tower"],
        },
        {
          id: "village-lights",
          title: "Distant village lights",
          category: "settlement",
          position: [1400, 820],
          confidence: 0.2,
          sources: [{ type: "trailer", ref: "Trailer 01:22" }],
          notes: "Very speculative; small clustered lights at dusk.",
          tags: ["settlement", "lights"],
        },
      ],
    },
  ],
};
