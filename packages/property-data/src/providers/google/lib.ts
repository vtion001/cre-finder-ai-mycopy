import { writeFileSync } from "node:fs";
import { Client, type PlaceData } from "@googlemaps/google-maps-services-js";
import { bbox } from "@turf/turf";
import * as turf from "@turf/turf";
import axios from "axios";
import type { Feature, Point, Polygon } from "geojson";
import { getStateFullName } from "../../utils/states";
import type { OSMBoundaryResponse } from "./types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const client = new Client({});

const OVERPASS_API = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_METERS = 20000; // 20 km
const MAX_REQUESTS = 156; // ~$5 cap at $0.032/request

export async function searchRegionAssets(
  regionName: string,
  assetType: string,
  regionType: "city" | "county",
  stateCode: string,
): Promise<PlaceData[]> {
  console.log(
    `🔍 Starting asset search for "${assetType}" in ${regionType} "${regionName}, ${stateCode}"`,
  );

  // Convert state code to full state name for Overpass API
  const stateFullName = getStateFullName(stateCode);
  const boundary = await getRegionBoundary(
    regionName,
    regionType,
    stateFullName,
  );
  console.log("✅ Fetched region boundary");

  console.log(`📏 Region boundary area: ${turf.area(boundary).toFixed(2)} sqm`);

  const aproxRadius = getPolygonApproxRadius(boundary);
  console.log(`📏 Region boundary radius: ${aproxRadius.toFixed(2)} km`);

  const points = generateGridPoints(boundary, SEARCH_RADIUS_METERS);
  console.log(`📍 Generated ${points.length} grid points for tiling`);

  const allResults: PlaceData[] = [];
  let requestCount = 0;

  for (const [i, center] of points.entries()) {
    if (requestCount >= MAX_REQUESTS) {
      console.warn("⚠️ Reached max request limit. Stopping further queries.");
      break;
    }

    try {
      console.log(
        `➡️ (${requestCount + 1}) Requesting Google Places for point ${i + 1}/${points.length}...`,
      );

      const results = await nearbySearchAllPages(center, assetType);
      allResults.push(...results);
      requestCount++;

      await sleep(200); // Basic throttling
    } catch (err) {
      console.error(`❌ Error fetching for point ${i + 1}:`, err);
    }
  }

  const filtered = filterResultsWithinBoundary(allResults, boundary);

  console.log(
    `✅ Finished search. Total unique results within boundary: ${filtered.length}`,
  );
  return filtered;
}

async function getRegionBoundary(
  regionName: string,
  regionType: "city" | "county",
  stateName: string,
) {
  const adminLevel = regionType === "city" ? 8 : 6;

  const query = `
    [out:json][timeout:25];
    area["admin_level"="4"]["name"="${stateName}"]->.state;
    relation["boundary"="administrative"]["admin_level"="${adminLevel}"]["name"="${regionName}"](area.state);
    out geom;
  `;

  console.log(
    `🌐 Fetching boundary from Overpass for ${regionName}, ${stateName}...`,
  );

  const { data } = await axios.get<OSMBoundaryResponse>(OVERPASS_API, {
    params: { data: query },
  });

  if (!data.elements || !data.elements.length) {
    console.error("❌ Region boundary not found in OSM");
    throw new Error("Region boundary not found in OSM");
  }

  const coords: [number, number][] = [];

  for (const element of data.elements) {
    if (element.type === "relation" && element.members) {
      for (const member of element.members) {
        // Only process "way" members that have geometry, ignore "node" members
        if (member.type === "way" && member.geometry) {
          for (const point of member.geometry) {
            // Convert lat/lon to [lon, lat] format for GeoJSON
            coords.push([point.lon, point.lat]);
          }
        }
      }
    }
  }

  if (coords.length === 0) {
    console.error("❌ No way geometries found in OSM boundary response");
    throw new Error("No way geometries found in OSM boundary response");
  }

  // Ensure the polygon is closed by adding the first point at the end if needed
  if (
    coords.length > 0 &&
    (coords[0]![0] !== coords[coords.length - 1]![0] ||
      coords[0]![1] !== coords[coords.length - 1]![1])
  ) {
    coords.push(coords[0]!);
  }

  console.log(`✅ Boundary received with ${coords.length} coordinate points`);
  return turf.polygon([coords]);
}

function generateGridPoints(
  polygon: Feature<Polygon>,
  radius: number,
): Point[] {
  const bounds = bbox(polygon);
  const cellSize = radius / 1000; // km
  const pointGrid = turf.pointGrid(bounds, cellSize, {
    units: "kilometers",
    mask: polygon,
  });

  console.log(`📏 Grid bounds: ${bounds}, cellSize: ${cellSize}km`);
  const points = pointGrid.features.map((f) => f.geometry);

  if (points.length < 1) {
    console.log(
      "⚠️ No grid points generated - boundary area too small. Using center point fallback.",
    );
    return [turf.centroid(polygon).geometry];
  }

  return points;
}

async function nearbySearchAllPages(
  center: Point,
  keyword: string,
  radius = SEARCH_RADIUS_METERS,
): Promise<PlaceData[]> {
  const location = {
    lat: center.coordinates[1]!,
    lng: center.coordinates[0]!,
  };

  const allResults: PlaceData[] = [];
  let pagetoken: string | undefined;

  console.log(
    `🌐 Starting Google Places search at ${location.lat}, ${location.lng}`,
  );

  for (let i = 0; i < 3; i++) {
    const response = await client.placesNearby({
      params: {
        key: GOOGLE_API_KEY!,
        location,
        radius,
        keyword,
        pagetoken,
      },
      timeout: 10000,
    });

    const results = response.data.results;
    allResults.push(...(results as PlaceData[]));

    console.log(`📄 Page ${i + 1}: Retrieved ${results.length} results`);

    if (!response.data.next_page_token) break;
    pagetoken = response.data.next_page_token;
    await sleep(2000); // Google requires wait time for next page
  }

  return allResults;
}

function filterResultsWithinBoundary(
  results: PlaceData[],
  boundary: Feature<Polygon>,
) {
  const allResults: Map<string, PlaceData> = new Map();

  let filteredCount = 0;
  let addedCount = 0;

  for (const place of results) {
    if (!allResults.has(place.place_id)) {
      // Filter out results outside the boundary
      if (place.geometry?.location) {
        const placePoint = turf.point([
          place.geometry.location.lng,
          place.geometry.location.lat,
        ]);
        if (turf.booleanPointInPolygon(placePoint, boundary)) {
          allResults.set(place.place_id, place);
          addedCount++;
        } else {
          filteredCount++;
        }
      }
    }
  }

  console.log(
    `✅ Retrieved ${results.length} results (${addedCount} added, ${filteredCount} filtered out as outside boundary)`,
  );

  return Array.from(allResults.values());
}

function getPolygonApproxRadius(polygon: Feature<Polygon>): number {
  const [minX, minY, maxX, maxY] = bbox(polygon);
  const centerPoint = turf.center(polygon);
  const furthestCorner = turf.point([maxX, maxY]);
  return turf.distance(centerPoint, furthestCorner, { units: "kilometers" });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
