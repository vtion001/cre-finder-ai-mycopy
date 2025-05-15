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
  | "office"
  | "retail"
  | "industrial"
  | "multifamily"
  | "land"
  | "hotel"
  | "mixed-use";

export interface SearchResult {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  size: number;
  price: number;
  yearBuilt: number;
  description: string;
  investmentType: string;
}

interface SearchResultsProps {
  isLoading?: boolean;
  results?: SearchResult[];

  searchQuery?: string;
}

const SAMPLE = [
  {
    id: "property-0-1747294666928",
    address: "683 Maple Dr",
    city: "New York",
    state: "AZ",
    zipCode: "13663",
    propertyType: "land",
    size: 74822,
    price: 6779856,
    yearBuilt: 1998,
    description: "A 74,822 sq ft land property built in 1998.",
    investmentType: "Core",
  },
  {
    id: "property-1-1747294666928",
    address: "891 Main St",
    city: "New York",
    state: "IL",
    zipCode: "96216",
    propertyType: "retail",
    size: 90126,
    price: 8922311,
    yearBuilt: 2004,
    description: "A 90,126 sq ft retail property built in 2004.",
    investmentType: "Core",
  },
  {
    id: "property-2-1747294666928",
    address: "845 Main Ln",
    city: "New York",
    state: "AZ",
    zipCode: "91906",
    propertyType: "hotel",
    size: 89336,
    price: 6719980,
    yearBuilt: 1989,
    description: "A 89,336 sq ft hotel property built in 1989.",
    investmentType: "Development",
  },
  {
    id: "property-3-1747294666928",
    address: "176 Cedar Ave",
    city: "New York",
    state: "IL",
    zipCode: "72887",
    propertyType: "land",
    size: 41233,
    price: 317910,
    yearBuilt: 1952,
    description: "A 41,233 sq ft land property built in 1952.",
    investmentType: "Core",
  },
  {
    id: "property-4-1747294666928",
    address: "1003 Oak Blvd",
    city: "New York",
    state: "IL",
    zipCode: "36487",
    propertyType: "hotel",
    size: 61406,
    price: 8528528,
    yearBuilt: 1965,
    description: "A 61,406 sq ft hotel property built in 1965.",
    investmentType: "Value-Add",
  },
  {
    id: "property-5-1747294666928",
    address: "519 Cedar Blvd",
    city: "New York",
    state: "NY",
    zipCode: "77985",
    propertyType: "industrial",
    size: 62313,
    price: 6590555,
    yearBuilt: 1977,
    description: "A 62,313 sq ft industrial property built in 1977.",
    investmentType: "Opportunistic",
  },
  {
    id: "property-6-1747294666929",
    address: "729 Broadway Ln",
    city: "New York",
    state: "NY",
    zipCode: "90907",
    propertyType: "land",
    size: 72409,
    price: 9575235,
    yearBuilt: 1958,
    description: "A 72,409 sq ft land property built in 1958.",
    investmentType: "Opportunistic",
  },
  {
    id: "property-7-1747294666929",
    address: "780 Broadway Ave",
    city: "New York",
    state: "IL",
    zipCode: "19457",
    propertyType: "hotel",
    size: 21634,
    price: 2814014,
    yearBuilt: 1961,
    description: "A 21,634 sq ft hotel property built in 1961.",
    investmentType: "Core Plus",
  },
];

export function SearchResults({
  // @ts-expect-error
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
        Address: result.address,
        City: result.city,
        State: result.state,
        "Zip Code": result.zipCode,
        "Property Type": result.propertyType,
        "Size (sq ft)": result.size,
        "Price ($)": result.price,
        "Year Built": result.yearBuilt,
        "Investment Type": result.investmentType,
        Description: result.description,
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
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-center">Criteria matched</TableHead>
            <TableHead className="text-center">CRE Property</TableHead>
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
                      {result.address}
                      <VerifiedIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.propertyType.charAt(0).toUpperCase() +
                        result.propertyType.slice(1)}{" "}
                      Investor
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {result.city}, {result.state}
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-accent/20 text-accent-foreground hover:bg-accent/20 border-accent/30">
                  1 of 1
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-accent-foreground" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
