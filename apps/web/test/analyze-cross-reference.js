#!/usr/bin/env node

/**
 * Detailed analysis script for cross-referencing results
 * Helps identify why certain properties don't match and potential improvements
 */

import { readFileSync } from "node:fs";

function normalizeAddressForMatching(address) {
  return address
    .toLowerCase()
    .trim()
    .replace(/[.,#]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\bhighway\s+(\d+)\s*([ns]?)\b/g, "hwy $1 $2")
    .replace(/\bsc-(\d+)\b/g, "hwy $1")
    .replace(/\bn\s+hwy\b/g, "hwy")
    .replace(/\bs\s+hwy\b/g, "hwy")
    .replace(/\bstreet\b/g, "st")
    .replace(/\bavenue\b/g, "ave")
    .replace(/\bdrive\b/g, "dr")
    .replace(/\broad\b/g, "rd")
    .replace(/\blane\b/g, "ln")
    .replace(/\bcourt\b/g, "ct")
    .replace(/\bplace\b/g, "pl")
    .replace(/\bboulevard\b/g, "blvd")
    .replace(/\bcircle\b/g, "cir")
    .replace(/\bparkway\b/g, "pkwy")
    .replace(/\bnorth\b/g, "n")
    .replace(/\bsouth\b/g, "s")
    .replace(/\beast\b/g, "e")
    .replace(/\bwest\b/g, "w")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const deltaLat = lat1 - lat2;
  const deltaLng = lng1 - lng2;
  return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
}

function analyzeMatching() {
  console.log("🔍 Detailed Cross-Reference Analysis\n");

  // Load JSON files
  const googleData = JSON.parse(
    readFileSync("apps/web/google-response.json", "utf8"),
  );
  const realEstateData = JSON.parse(
    readFileSync("apps/web/realestate-response.json", "utf8"),
  );

  console.log("📊 Data Overview:");
  console.log(`Google Places: ${googleData.data.length} results`);
  console.log(`Real Estate API: ${realEstateData.data.length} results\n`);

  // Create normalized Google Places lookup
  const googleLookup = new Map();
  const googleCoordinates = [];

  googleData.data.forEach((place) => {
    const cleanAddress = place.formatted_address.replace(
      /, United States$/,
      "",
    );
    const normalized = normalizeAddressForMatching(cleanAddress);

    googleLookup.set(normalized, {
      name: place.name,
      address: place.formatted_address,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    });

    googleCoordinates.push({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      name: place.name,
      address: cleanAddress,
    });

    // Also add street-only variation
    const addressParts = cleanAddress.split(",");
    if (addressParts.length > 0) {
      const streetOnly = normalizeAddressForMatching(addressParts[0].trim());
      if (!googleLookup.has(streetOnly)) {
        googleLookup.set(streetOnly, {
          name: `${place.name} (street match)`,
          address: place.formatted_address,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        });
      }
    }
  });

  console.log("🗂️  Google Places Normalized Addresses:");
  console.log("=====================================");
  Array.from(googleLookup.entries())
    .slice(0, 10)
    .forEach(([key, value]) => {
      console.log(`"${key}" -> ${value.name}`);
    });
  console.log(`... and ${googleLookup.size - 10} more\n`);

  // Analyze each Real Estate property
  let matches = 0;
  let addressMatches = 0;
  let proximityMatches = 0;
  const unmatched = [];

  console.log("🏢 Real Estate Properties Analysis:");
  console.log("==================================");

  realEstateData.data.forEach((property, index) => {
    const addressVariations = [
      property.address.address,
      property.address.street,
      `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
      `${property.address.address}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
    ].filter(Boolean);

    let matched = false;
    let matchType = null;
    let matchedPlace = null;

    // Try address matching
    for (const addr of addressVariations) {
      if (typeof addr === "string") {
        const normalized = normalizeAddressForMatching(addr);
        if (googleLookup.has(normalized)) {
          matched = true;
          matchType = "address";
          matchedPlace = googleLookup.get(normalized);
          addressMatches++;
          break;
        }
      }
    }

    // Try proximity matching if no address match
    if (
      !matched &&
      typeof property.latitude === "number" &&
      typeof property.longitude === "number"
    ) {
      const proximityMatch = googleCoordinates.find((coord) => {
        const distance = calculateDistance(
          property.latitude,
          property.longitude,
          coord.lat,
          coord.lng,
        );
        return distance <= 0.001;
      });

      if (proximityMatch) {
        matched = true;
        matchType = "proximity";
        matchedPlace = proximityMatch;
        proximityMatches++;
      }
    }

    if (matched) {
      matches++;
      console.log(
        `✅ ${index + 1}. MATCH (${matchType}): ${property.address.address} -> ${matchedPlace.name}`,
      );
    } else {
      unmatched.push({
        index: index + 1,
        address: property.address.address,
        normalized: normalizeAddressForMatching(property.address.address),
        owner: property.owner1LastName,
        company: property.companyName,
        coordinates:
          property.latitude && property.longitude
            ? `${property.latitude}, ${property.longitude}`
            : "No coordinates",
      });
    }
  });

  console.log("\n📈 Results Summary:");
  console.log("==================");
  console.log(
    `Total matches: ${matches}/${realEstateData.data.length} (${((matches / realEstateData.data.length) * 100).toFixed(1)}%)`,
  );
  console.log(`Address matches: ${addressMatches}`);
  console.log(`Proximity matches: ${proximityMatches}`);
  console.log(`Unmatched: ${unmatched.length}\n`);

  // Show some unmatched properties for analysis
  console.log("❌ Sample Unmatched Properties:");
  console.log("==============================");
  unmatched.slice(0, 10).forEach((prop) => {
    console.log(`${prop.index}. ${prop.address}`);
    console.log(`   Normalized: "${prop.normalized}"`);
    console.log(`   Owner: ${prop.owner || "N/A"}`);
    console.log(`   Company: ${prop.company || "N/A"}`);
    console.log(`   Coordinates: ${prop.coordinates}`);
    console.log("");
  });

  if (unmatched.length > 10) {
    console.log(`... and ${unmatched.length - 10} more unmatched properties\n`);
  }

  // Suggest potential improvements
  console.log("💡 Potential Improvements:");
  console.log("=========================");

  const hasCoordinates = unmatched.filter(
    (p) => p.coordinates !== "No coordinates",
  ).length;
  console.log(
    `- ${hasCoordinates} unmatched properties have coordinates for proximity matching`,
  );

  const businessNames = unmatched.filter((p) =>
    p.company?.toLowerCase().includes("storage"),
  ).length;
  console.log(
    `- ${businessNames} unmatched properties have "storage" in company name`,
  );

  console.log("- Consider expanding proximity threshold beyond 0.001 degrees");
  console.log("- Consider fuzzy string matching for business names");
  console.log(
    "- Consider partial address matching (street number + street name only)",
  );
}

// Run the analysis
analyzeMatching();
