"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@v1/ui/avatar";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import {
  BuildingIcon,
  CheckCircleIcon,
  DownloadIcon,
  VerifiedIcon,
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
export type PropertyType =
  | "SFR"
  | "office"
  | "retail"
  | "industrial"
  | "multifamily"
  | "land"
  | "hotel"
  | "mixed-use";

export interface Address {
  address: string;
  county?: string;
  fips?: string;
  state: string;
  street: string;
  zip: string;
  city?: string;
}

export interface MailAddress {
  address: string;
  city: string;
  state: string;
  street: string;
  zip: string;
}

export interface SearchResult {
  id: string;
  propertyId: string;
  address: Address;
  mailAddress?: MailAddress;
  propertyType: string;
  propertyUse: string;
  landUse: string;
  squareFeet: number;
  lotSquareFeet: number;
  assessedValue: number;
  estimatedValue: number;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  roomsCount: number;
  stories: number;
  ownerOccupied: boolean;
  owner1FirstName?: string;
  owner1LastName?: string;
  owner2FirstName?: string;
  owner2LastName?: string;
  highEquity?: boolean;
  equityPercent?: number;
  estimatedEquity?: number;
  openMortgageBalance?: number;
  latitude?: number;
  longitude?: number;
}

interface SearchResultsProps {
  isLoading?: boolean;
  results?: SearchResult[];

  searchQuery?: string;
}

const SAMPLE = [
  {
    id: "700058523698",
    propertyId: "700058523698",
    address: {
      address: "Laurel Branch Rd, , KY 40972",
      county: "Clay County",
      fips: "21051",
      state: "KY",
      street: "Laurel Branch Rd",
      zip: "40972",
    },
    adjustableRate: false,
    airConditioningAvailable: false,
    apn: "146-00-00-006.00",
    assessedImprovementValue: 0,
    assessedLandValue: 0,
    assessedValue: 40500,
    assumable: false,
    auction: false,
    auctionDate: null,
    basement: false,
    bathrooms: 1,
    bedrooms: 3,
    cashBuyer: false,
    corporateOwned: false,
    death: false,
    deck: false,
    deckArea: 0,
    equity: false,
    equityPercent: 85,
    estimatedEquity: 126089,
    estimatedValue: 147000,
    floodZone: false,
    foreclosure: false,
    forSale: false,
    freeClear: false,
    garage: false,
    highEquity: true,
    hoa: null,
    inherited: false,
    inStateAbsenteeOwner: false,
    investorBuyer: false,
    judgment: false,
    landUse: "Single Family Residential",
    lastMortgage1Amount: null,
    lastSaleAmount: "0",
    lastSaleArmsLength: null,
    lastUpdateDate: "2025-04-16 00:00:00 UTC",
    latitude: 37.24727597781644,
    lenderName: "Chase Manhattan Bank Usa Na",
    listingAmount: null,
    loanTypeCode: "COV",
    longitude: -83.64654668784793,
    lotSquareFeet: 47175,
    mailAddress: {
      address: "Po Box 152, Oneida, KY 40972",
      city: "Oneida",
      state: "KY",
      street: "Po Box 152",
      zip: "40972",
    },
    maturityDateFirst: "2020-02-15",
    MFH2to4: false,
    MFH5plus: false,
    mlsActive: false,
    mlsCancelled: false,
    mlsFailed: false,
    mlsHasPhotos: false,
    mlsListingPrice: null,
    mlsPending: false,
    mlsSold: false,
    negativeEquity: false,
    openMortgageBalance: 39200,
    outOfStateAbsenteeOwner: false,
    owner1FirstName: "Matthew",
    owner1LastName: "Couch",
    owner2FirstName: "Archie",
    owner2LastName: "Couch",
    ownerOccupied: true,
    parcelAccountNumber: "114563",
    patio: false,
    patioArea: 0,
    pool: false,
    poolArea: 0,
    preForeclosure: false,
    pricePerSquareFoot: 0,
    priorSaleAmount: null,
    privateLender: false,
    propertyType: "SFR",
    propertyUse: "Single Family Residence",
    propertyUseCode: 385,
    rentAmount: null,
    reo: false,
    roomsCount: 6,
    squareFeet: 1032,
    stories: 1,
    taxLien: null,
    unitsCount: 0,
    vacant: false,
    yearBuilt: 1977,
    yearsOwned: null,
  },
  {
    id: "700058523699",
    propertyId: "700058523699",
    address: {
      address: "123 Main St, New York, NY 10001",
      county: "New York County",
      fips: "36061",
      state: "NY",
      street: "123 Main St",
      zip: "10001",
      city: "New York",
    },
    assessedValue: 750000,
    estimatedValue: 850000,
    bathrooms: 2,
    bedrooms: 3,
    equityPercent: 65,
    estimatedEquity: 552500,
    highEquity: true,
    landUse: "Single Family Residential",
    lotSquareFeet: 5000,
    openMortgageBalance: 297500,
    owner1FirstName: "John",
    owner1LastName: "Smith",
    ownerOccupied: true,
    propertyType: "SFR",
    propertyUse: "Single Family Residence",
    roomsCount: 7,
    squareFeet: 2200,
    stories: 2,
    yearBuilt: 1985,
  },
  {
    id: "700058523700",
    propertyId: "700058523700",
    address: {
      address: "456 Oak Ave, New York, NY 10002",
      county: "New York County",
      fips: "36061",
      state: "NY",
      street: "456 Oak Ave",
      zip: "10002",
      city: "New York",
    },
    assessedValue: 1200000,
    estimatedValue: 1350000,
    bathrooms: 3,
    bedrooms: 4,
    equityPercent: 75,
    estimatedEquity: 1012500,
    highEquity: true,
    landUse: "Single Family Residential",
    lotSquareFeet: 7500,
    openMortgageBalance: 337500,
    owner1FirstName: "Sarah",
    owner1LastName: "Johnson",
    ownerOccupied: false,
    propertyType: "SFR",
    propertyUse: "Single Family Residence",
    roomsCount: 9,
    squareFeet: 3100,
    stories: 2,
    yearBuilt: 1992,
  },
];

export function SearchResults({
  results = SAMPLE,
  searchQuery = "New York",
  isLoading,
}: SearchResultsProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Handle export to Excel
  const handleExport = () => {
    if (results.length === 0) return;

    setIsExporting(true);

    try {
      // Format data for Excel
      const exportData = results.map((result) => ({
        "Property ID": result.propertyId,
        Address: result.address.address,
        Street: result.address.street,
        City: result.address.city || result.mailAddress?.city || "",
        State: result.address.state,
        Zip: result.address.zip,
        County: result.address.county || "",
        "Property Type": result.propertyType,
        "Property Use": result.propertyUse,
        "Land Use": result.landUse,
        "Square Feet": result.squareFeet,
        "Lot Size (sq ft)": result.lotSquareFeet,
        "Assessed Value ($)": result.assessedValue,
        "Estimated Value ($)": result.estimatedValue,
        "Year Built": result.yearBuilt,
        Bedrooms: result.bedrooms,
        Bathrooms: result.bathrooms,
        Rooms: result.roomsCount,
        Stories: result.stories,
        "Owner Occupied": result.ownerOccupied ? "Yes" : "No",
        Owner:
          result.owner1FirstName && result.owner1LastName
            ? `${result.owner1FirstName} ${result.owner1LastName}`
            : "",
        "High Equity": result.highEquity ? "Yes" : "No",
        "Equity %": result.equityPercent || 0,
        "Estimated Equity ($)": result.estimatedEquity || 0,
        "Mortgage Balance ($)": result.openMortgageBalance || 0,
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

      // Generate Excel file
      XLSX.writeFile(workbook, `CREfinder_${searchQuery}_Results.xlsx`);

      toast.success("Results exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export results");
    } finally {
      setIsExporting(false);
    }
  };

  // If no search has been performed yet
  if (!searchQuery && !isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BuildingIcon className="mx-auto mb-2 h-12 w-12 opacity-20" />
        <p>Enter a city name to search for properties</p>
      </div>
    );
  }

  // If loading
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  // If no results found
  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BuildingIcon className="mx-auto mb-2 h-12 w-12 opacity-20" />
        <p>No properties found for "{searchQuery}"</p>
        <p className="text-sm mt-2">
          Try adjusting your filters or search for a different city
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end p-4 border-b">
        <Button
          onClick={handleExport}
          disabled={isExporting || results.length === 0}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <DownloadIcon className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export to Excel"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[250px]">Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-center">Owner</TableHead>
            <TableHead className="text-center">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {result.propertyType.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {result.address.street}
                      <VerifiedIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.propertyUse || result.landUse}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {result.address.city || result.mailAddress?.city || ""},{" "}
                {result.address.state}
              </TableCell>
              <TableCell className="text-center">
                {result.owner1FirstName && result.owner1LastName ? (
                  <Badge className="bg-accent/20 text-accent-foreground hover:bg-accent/20 border-accent/30">
                    {result.owner1FirstName} {result.owner1LastName}
                  </Badge>
                ) : (
                  <Badge variant="outline">Unknown</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  {result.highEquity && (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-primary/30">
                      High Equity
                    </Badge>
                  )}
                  {result.ownerOccupied && (
                    <div title="Owner Occupied">
                      <CheckCircleIcon className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
