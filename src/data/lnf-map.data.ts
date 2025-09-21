// src/data/lnf-map.data.ts
import type { MapConfig } from "./lnf-map.schema";

export const LNF_MAP: MapConfig = {
  base: {
    imageUrl: "/images/int_map/lnf-speculative-world.webp",
    size: [4000, 2668],
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
          id: "biome_wastelands",
          title: "Destroyed Biome / Wastelands",
          category: "biome",
          position: [980, 1000],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:08" }],
          notes: "Scene with Skelotons and yellowish tint. Destroyed Structures and Dead Trees.",
          tags: ["destroyed", "dead trees"],
          thumbUrl: "/images/int_map/thumbs/biome_wastelands.webp",
          media: [
            {
              id: "biome_wastelands_1",
              thumbUrl: "/images/int_map/thumbs/biome_wastelands.webp",
              fullUrl: "/images/int_map/full/biome_wastelands.webp",
              caption: "Third Person View of a Skeleton walking in the Wastelands",
              timecode: "00:08",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_spruce_forest",
          title: "Spruce / Mixed Forest",
          category: "biome",
          position: [2900, 2200],
          confidence: 0.4,
          sources: [{ type: "trailer", ref: "Trailer 01:00" }],
          notes: "Dense Forest with high terrains; likely temperate biome.",
          tags: ["forest", "hills"],
          thumbUrl: "/images/int_map/thumbs/biome_spruce_forest.webp",
          media: [
            {
              id: "biome_spruce_forest_1",
              thumbUrl: "/images/int_map/thumbs/biome_spruce_forest.webp",
              fullUrl: "/images/int_map/full/biome_spruce_forest.webp",
              caption: "Dense Forest, View from a Dragon",
              timecode: "01:00",
              source: "trailer",
            },
            {
              id: "biome_spruce_forest_2",
              thumbUrl: "/images/int_map/thumbs/biome_spruce_forest_2.webp",
              fullUrl: "/images/int_map/full/biome_spruce_forest_2.webp",
              caption: "Dense Forest, View from a Bird",
              timecode: "01:36",
              source: "trailer",
            },
          ],
        },
        {
          id: "biome_snow_spikes",
          title: "Snow Pillars/Spikes",
          category: "biome",
          position: [1960, 2450],
          confidence: 0.2,
          sources: [{ type: "trailer", ref: "Trailer 00:30" }],
          notes: "Scene with a red glare. Red Cube Floating and snowy high but slim mountains.",
          tags: ["snow", "mountains", "special"],
          thumbUrl: "/images/int_map/thumbs/biome_snow_spikes.webp",
          media: [
            {
              id: "biome_snow_spikes_1",
              thumbUrl: "/images/int_map/thumbs/biome_snow_spikes.webp",
              fullUrl: "/images/int_map/full/biome_snow_spikes.webp",
              caption: "Scene with a red glare. Red Cube floating and snowy high but slim mountains.",
              timecode: "00:30",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_snow_peaks",
          title: "High Snow Peaks",
          category: "biome",
          position: [850, 2450],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:28" }],
          notes: "Really High Snowy Peaks in the Mountains",
          tags: ["snow", "mountain", "high"],
          thumbUrl: "/images/int_map/thumbs/biome_snow_peaks.webp",
          media: [
            {
              id: "biome_snow_peaks_1",
              thumbUrl: "/images/int_map/thumbs/biome_snow_peaks.webp",
              fullUrl: "/images/int_map/full/biome_snow_peaks.webp",
              caption: "A Dragon flying through really high snowy Peaks.",
              timecode: "00:28",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_savanna",
          title: "Savanna",
          category: "biome",
          position: [2060, 500],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 01:25" }],
          notes: "A Dessert-Like looking Biome with a few bushes and palm trees.",
          tags: ["savanna", "sand"],
          thumbUrl: "/images/int_map/thumbs/biome_svanna.webp",
          media: [
            {
              id: "biome_savanna_1",
              thumbUrl: "/images/int_map/thumbs/biome_savanna.webp",
              fullUrl: "/images/int_map/full/biome_savanna.webp",
              caption: "A hord of Buffalos riding thorugh the savanna",
              timecode: "01:25",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_rocky_mountains",
          title: "High Rocky Mountains",
          category: "biome",
          position: [2200, 1600],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:30" }],
          notes: "High Mountains with rock floor and a few Trees.",
          tags: ["rocky", "high", "mountains"],
          thumbUrl: "/images/int_map/thumbs/biome_rocky_mountains.webp",
          media: [
            {
              id: "biome_rocky_mountains_1",
              thumbUrl: "/images/int_map/thumbs/biome_rocky_mountains.webp",
              fullUrl: "/images/int_map/full/biome_rocky_mountains.webp",
              caption: "Human-alike gliding off the rocky mountains",
              timecode: "00:30",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_rocky_lands",
          title: "Rocky Wastelands",
          category: "biome",
          position: [3300, 1600],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:46" }],
          notes: "Dead Trees and Rocky floor.",
          tags: ["rocky", "dead trees"],
          thumbUrl: "/images/int_map/thumbs/biome_rocky_lands.webp",
          media: [
            {
              id: "biome_rocky_lands_1",
              thumbUrl: "/images/int_map/thumbs/biome_rocky_lands.webp",
              fullUrl: "/images/int_map/full/biome_rocky_lands.webp",
              caption: "A Fight against Crabs in the Rocky Wastelands.",
              timecode: "00:46",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_redwood",
          title: "Redwood Forest",
          category: "biome",
          position: [3300, 1950],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:13" }],
          notes: "Red Leaves everywhere. This looks like Autumn with glowing Red Leafes on high Trees.",
          tags: ["forest", "redwood"],
          thumbUrl: "/images/int_map/thumbs/biome_redwood.webp",
          media: [
            {
              id: "biome_redwood_1",
              thumbUrl: "/images/int_map/thumbs/biome_redwood.webp",
              fullUrl: "/images/int_map/full/biome_redwood.webp",
              caption: "Third Person View of a Skeleton walking in the Wastelands",
              timecode: "00:13",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_ocean_peaks",
          title: "Ocean Peaks",
          category: "biome",
          position: [2700, 600],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 01:01" }],
          notes: "Slim Mountains peaking out of the water. Juciy Green Grass.",
          tags: ["water", "green grass"],
          thumbUrl: "/images/int_map/thumbs/biome_ocean_peaks.webp",
          media: [
            {
              id: "biome_ocean_peaks_1",
              thumbUrl: "/images/int_map/thumbs/biome_ocean_peaks.webp",
              fullUrl: "/images/int_map/full/biome_ocean_peaks.webp",
              caption: "A Dragon flying over water besides green grass peaks.",
              timecode: "01:01",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_ocean_island",
          title: "Island",
          category: "biome",
          position: [3600, 1390],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:46" }],
          notes: "A Island on the vast Ocean.",
          tags: ["water", "island"],
          thumbUrl: "/images/int_map/thumbs/biome_ocean_island.webp",
          media: [
            {
              id: "biome_ocean_island_1",
              thumbUrl: "/images/int_map/thumbs/biome_ocean_island.webp",
              fullUrl: "/images/int_map/full/biome_ocean_island.webp",
              caption: "A team preparing to conquer the ocean to an island.",
              timecode: "00:46",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_high_cliffs",
          title: "High Cliffs",
          category: "biome",
          position: [1800, 1350],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:00" }],
          notes: "Really High cliffs dropping a few hundred meters below into the Ocean.",
          tags: ["high", "water"],
          thumbUrl: "/images/int_map/thumbs/biome_high_cliffs.webp",
          media: [
            {
              id: "biome_high_cliffs_1",
              thumbUrl: "/images/int_map/thumbs/biome_high_cliffs.webp",
              fullUrl: "/images/int_map/full/biome_high_cliffs.webp",
              caption: "A Team looking down the High Cliffs",
              timecode: "00:00",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_grassland",
          title: "Grasslands",
          category: "biome",
          position: [1900, 1080],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:32" }],
          notes: "Colorful Flowers and juicy green Grass. Flat Terrain with a few hills.",
          tags: ["flat", "grass"],
          thumbUrl: "/images/int_map/thumbs/biome_grassland.webp",
          media: [
            {
              id: "biome_grassland_1",
              thumbUrl: "/images/int_map/thumbs/biome_grassland.webp",
              fullUrl: "/images/int_map/full/biome_grassland.webp",
              caption: "A Human-like walking towards a town on the Grassland.",
              timecode: "00:32",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_grassland_mountainside",
          title: "Grasslands next to Snowy Mountains",
          category: "biome",
          position: [3350, 2250],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:36" }],
          notes: "Coloful Flowers High Snowy Mountains and infront of them flat terrain.",
          tags: ["mountain", "grass"],
          thumbUrl: "/images/int_map/thumbs/biome_grassland_mountainside.webp",
          media: [
            {
              id: "biome_grassland_mountainside_1",
              thumbUrl: "/images/int_map/thumbs/biome_grassland_mountainside.webp",
              fullUrl: "/images/int_map/full/biome_grassland_mountainside.webp",
              caption: "Flying next to a high mountainside on flat grassy terrain.",
              timecode: "00:36",
              source: "trailer",
            },
            {
              id: "biome_grassland_mountainside_2",
              thumbUrl: "/images/int_map/thumbs/biome_grassland_mountainside_2.webp",
              fullUrl: "/images/int_map/full/biome_grassland_mountainside_2.webp",
              caption: "A wooden House infront of high snowy Mountains.",
              timecode: "00:36",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_forest_flower_mountains",
          title: "Forest Hills",
          category: "biome",
          position: [375, 1850],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:04" }],
          notes: "A Forest with small mountains and colorful Flowers.",
          tags: ["forest", "mountain"],
          thumbUrl: "/images/int_map/thumbs/biome_forest_flower_mountains.webp",
          media: [
            {
              id: "biome_forest_flower_mountains_1",
              thumbUrl: "/images/int_map/thumbs/biome_forest_flower_mountains.webp",
              fullUrl: "/images/int_map/full/biome_forest_flower_mountains.webp",
              caption: "A Human-Like walking on a mountain in a Forrest next to a statue.",
              timecode: "00:04",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_flat_ocean",
          title: "Shallow Oceans",
          category: "biome",
          position: [1160, 880],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:16" }],
          notes: "Shallow but really alive Oceans filled with storys.",
          tags: ["water", "animals"],
          thumbUrl: "/images/int_map/thumbs/biome_flat_ocean.webp",
          media: [
            {
              id: "biome_flat_ocean_1",
              thumbUrl: "/images/int_map/thumbs/biome_flat_ocean.webp",
              fullUrl: "/images/int_map/full/biome_flat_ocean.webp",
              caption: "Swimming through a shallow ocean with Squids, Kelp and sunken Ships.",
              timecode: "00:16",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_dead_grassland",
          title: "Dark Grasslands",
          category: "biome",
          position: [3400, 700],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 01:15" }],
          notes: "Rainy Look, Dead Trees and colorful FLowers.",
          tags: ["grass", "dead trees"],
          thumbUrl: "/images/int_map/thumbs/biome_dead_grassland.webp",
          media: [
            {
              id: "biome_dead_grassland_1",
              thumbUrl: "/images/int_map/thumbs/biome_dead_grassland.webp",
              fullUrl: "/images/int_map/full/biome_dead_grassland.webp",
              caption: "A Giant Statue in the Dark Grasslands",
              timecode: "01:15",
              source: "trailer",
            }
          ],
        },
        {
          id: "biome_dead_forest",
          title: "Dead Forest",
          category: "biome",
          position: [400, 600],
          confidence: 0.6,
          sources: [{ type: "trailer", ref: "Trailer 00:30" }],
          notes: "A bright but dead Forest with frozen looking grass",
          tags: ["forest", "dead trees"],
          thumbUrl: "/images/int_map/thumbs/biome_dead_forest.webp",
          media: [
            {
              id: "biome_dead_forest_1",
              thumbUrl: "/images/int_map/thumbs/biome_dead_forest.webp",
              fullUrl: "/images/int_map/full/biome_dead_forest.webp",
              caption: "Human-Like with two Crows.",
              timecode: "00:30",
              source: "trailer",
            }
          ],
        },
      ],
    },
    {
      id: "creatures",
      title: "Creatures & Mounts",
      visibleByDefault: true,
      markers: [
        
      ],
    },
    {
      id: "structures",
      title: "Structures & Settlements",
      visibleByDefault: true,
      markers: [
        
        
      ],
    },
  ],
};
