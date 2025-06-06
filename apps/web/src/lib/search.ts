"use server"

import { createClient } from "@v1/supabase/server";
import { searchStorageFacilities } from "./google-places";
import { getPropertySearch } from "./realestateapi";
import { capitalize } from "./format";

function parseLocationCode(code: string) {
    const parts = code.toLowerCase().split('-');
    const [type, state, ...nameParts] = parts;

    const name = nameParts.map(capitalize).join(' ');

    if ((type !== "c" && type !== "n") || !state || !name) {
        throw new Error("Invalid location code");
    }


    return {

        state: state.toUpperCase(),
        city: type === "c" ? name : undefined,
        county: type === "n" ? name : undefined,
    };
}

export async function getPreview(asset_type_slugs: string[], location: string) {

    const supabase = createClient();

    const { data: assetTypes } = await supabase
        .from("asset_types")
        .select("*")
        .in("slug", asset_type_slugs);

    if (!assetTypes || assetTypes.length === 0) {
        throw new Error("Asset types not found");
    }

    const storageUnitType = assetTypes.find(
        (type) => type.slug === "self-storage"
    );

    const otherAssetTypes = assetTypes.filter(
        (type) => type.slug !== "self-storage"
    );

    const locationParams = parseLocationCode(location);

    console.log("locationParams", locationParams);

    // count storage units separately (google results only)
    let storageUnitCount = 0;
    if (storageUnitType) {
        const googleResponse = await searchStorageFacilities(locationParams);
        storageUnitCount = googleResponse.results.length;
    }

    let otherAssetTypeCount = 0;
    if (otherAssetTypes.length > 0) {
        const useCodes = otherAssetTypes
            .flatMap((type) => type.use_codes || [])
            .filter((code, index, arr) => arr.indexOf(code) === index);

        const params = {
            ...locationParams,
            property_use_code: useCodes,
        };

        const realestateapiResponse = await getPropertySearch(params, true);
        otherAssetTypeCount = realestateapiResponse.resultCount;
    }

    const resultCount = storageUnitCount + otherAssetTypeCount;

    const formattedLocation = `${locationParams.city || locationParams.county}, ${locationParams.state}`;

    return {
        resultCount,
        formattedLocation,
        assetTypes: assetTypes.map((type) => type.name),
    };
}

