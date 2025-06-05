#!/usr/bin/env node

/**
 * Test script for cross-referencing Google Places and Real Estate API results
 * Uses the actual JSON response files to test the matching logic
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// Import the cross-reference function (we'll need to adapt it for Node.js)
// Since the original is TypeScript, we'll recreate the core logic here
function normalizeAddressForMatching(address) {
  return (
    address
      .toLowerCase()
      .trim()
      // Remove common punctuation and extra spaces
      .replace(/[.,#]/g, "")
      .replace(/\s+/g, " ")
      // Handle highway naming variations (key insight from data analysis)
      .replace(/\bhighway\s+(\d+)\s*([ns]?)\b/g, "hwy $1 $2")
      .replace(/\bsc-(\d+)\b/g, "hwy $1")
      .replace(/\bn\s+hwy\b/g, "hwy")
      .replace(/\bs\s+hwy\b/g, "hwy")
      // Normalize common address abbreviations
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
      // Normalize directional indicators
      .replace(/\bnorth\b/g, "n")
      .replace(/\bsouth\b/g, "s")
      .replace(/\beast\b/g, "e")
      .replace(/\bwest\b/g, "w")
      // Clean up extra spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const deltaLat = lat1 - lat2;
  const deltaLng = lng1 - lng2;
  return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
}

function crossReferenceResults(realEstateResults, googlePlacesResults) {
  if (googlePlacesResults.length === 0) {
    return realEstateResults;
  }

  // Create lookup structures for Google Places data
  const googleAddressSet = new Set();
  const googleCoordinates = [];

  for (const place of googlePlacesResults) {
    // Normalize Google Places address (remove ", United States" suffix)
    const cleanAddress = place.formatted_address.replace(
      /, United States$/,
      "",
    );
    const normalizedAddress = normalizeAddressForMatching(cleanAddress);
    googleAddressSet.add(normalizedAddress);

    // Store coordinates for proximity matching
    googleCoordinates.push({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: normalizedAddress,
      name: place.name,
    });

    // Add street-only variation for partial matching
    const addressParts = cleanAddress.split(",");
    if (addressParts.length > 0) {
      const streetOnly = normalizeAddressForMatching(addressParts[0].trim());
      googleAddressSet.add(streetOnly);
    }
  }

  // Filter Real Estate API results to only include those with matching locations
  const matches = [];

  for (const property of realEstateResults) {
    // Try address-based matching first
    const addressVariations = [
      property.address.address,
      property.address.street,
      `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
      `${property.address.address}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
    ].filter(Boolean);

    let matchType = null;
    let matchedGoogle = null;

    const hasAddressMatch = addressVariations.some((address) => {
      if (typeof address === "string") {
        const normalizedAddress = normalizeAddressForMatching(address);
        if (googleAddressSet.has(normalizedAddress)) {
          matchType = "address";
          // Find which Google place matched
          matchedGoogle = googleCoordinates.find(
            (g) => g.address === normalizedAddress,
          );
          return true;
        }
      }
      return false;
    });

    if (hasAddressMatch) {
      matches.push({
        property,
        matchType,
        matchedGoogle,
        distance: matchedGoogle
          ? calculateDistance(
              property.latitude,
              property.longitude,
              matchedGoogle.lat,
              matchedGoogle.lng,
            )
          : null,
      });
      continue;
    }

    // If no address match, try coordinate proximity matching (within ~100 meters)
    if (
      typeof property.latitude === "number" &&
      typeof property.longitude === "number"
    ) {
      const proximityMatch = googleCoordinates.find((googleCoord) => {
        const distance = calculateDistance(
          property.latitude,
          property.longitude,
          googleCoord.lat,
          googleCoord.lng,
        );
        return distance <= 0.001; // Approximately 100 meters
      });

      if (proximityMatch) {
        matches.push({
          property,
          matchType: "proximity",
          matchedGoogle: proximityMatch,
          distance: calculateDistance(
            property.latitude,
            property.longitude,
            proximityMatch.lat,
            proximityMatch.lng,
          ),
        });
      }
    }
  }

  return matches;
}

// Main test function
function testCrossReference() {
  console.log("🧪 Testing Cross-Reference Function with JSON Files\n");

  // Load JSON files
  const googleFile = "apps/web/google-response.json";
  const realEstateFile = "apps/web/realestate-response.json";

  if (!existsSync(googleFile)) {
    console.error(`❌ Google Places file not found: ${googleFile}`);
    return;
  }

  if (!existsSync(realEstateFile)) {
    console.error(`❌ Real Estate API file not found: ${realEstateFile}`);
    return;
  }

  console.log("📁 Loading JSON files...");
  const googleData = JSON.parse(readFileSync(googleFile, "utf8"));
  const realEstateData = JSON.parse(readFileSync(realEstateFile, "utf8"));

  console.log(`📊 Google Places results: ${googleData.data.length}`);
  console.log(`📊 Real Estate API results: ${realEstateData.data.length}\n`);

  // Run cross-reference
  console.log("🔄 Running cross-reference...");
  const matches = crossReferenceResults(realEstateData.data, googleData.data);

  console.log(
    `\n✅ Found ${matches.length} matches out of ${realEstateData.data.length} real estate properties\n`,
  );

  // Display detailed results
  if (matches.length > 0) {
    console.log("📋 Match Details:");
    console.log("================");

    matches.forEach((match, index) => {
      console.log(`\n${index + 1}. ${match.matchType.toUpperCase()} MATCH`);
      console.log(`   Real Estate: ${match.property.address.address}`);
      console.log(`   Google Place: ${match.matchedGoogle.name}`);
      console.log(
        `   Coordinates Distance: ${match.distance ? match.distance.toFixed(6) : "N/A"}`,
      );
      console.log(
        `   Property Owner: ${match.property.owner1LastName || "N/A"}`,
      );
      console.log(`   Company: ${match.property.companyName || "N/A"}`);
    });
  } else {
    console.log(
      "❌ No matches found. This might indicate issues with the matching logic.",
    );
  }

  // Summary statistics
  const addressMatches = matches.filter(
    (m) => m.matchType === "address",
  ).length;
  const proximityMatches = matches.filter(
    (m) => m.matchType === "proximity",
  ).length;

  console.log("\n📈 Summary:");
  console.log("===========");
  console.log(`Total matches: ${matches.length}`);
  console.log(`Address matches: ${addressMatches}`);
  console.log(`Proximity matches: ${proximityMatches}`);
  console.log(
    `Match rate: ${((matches.length / realEstateData.data.length) * 100).toFixed(1)}%`,
  );
}

// Run the test
testCrossReference();
