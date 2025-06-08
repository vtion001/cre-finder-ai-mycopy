"use client";

import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { AddLocationsDialog } from "./add-locations-dialog";

interface AddLocationsButtonProps {
  assetType: string;
  assetTypeName: string;
  existingLicenses: Tables<"user_licenses">[];
}

export function AddLocationsButton({
  assetType,
  assetTypeName,
  existingLicenses,
}: AddLocationsButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const existingLocationIds = existingLicenses.map(
    (license) => license.location_internal_id
  );

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setDialogOpen(true)}
        className="h-12 px-4 border-dashed"
      >
        <IconPlus className="h-4 w-4 mr-2" />
        Add Locations
      </Button>

      <AddLocationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assetType={assetType}
        assetTypeName={assetTypeName}
        existingLocationIds={existingLocationIds}
      />
    </>
  );
}
