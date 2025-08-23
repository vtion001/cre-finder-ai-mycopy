"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreateCampaignDialog } from "./create-campaign-dialog";

export function RecordsCampaignDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;
    
    const campaignParam = searchParams.get("campaign");
    const idsParam = searchParams.get("ids");

    if (campaignParam === "open" && idsParam) {
      try {
        const ids = JSON.parse(idsParam);
        setSelectedRecordIds(ids);
        setIsOpen(true);
        
        // Clean up URL params
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("campaign");
        newSearchParams.delete("ids");
        const newUrl = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`;
        router.replace(newUrl);
      } catch (error) {
        console.error("Error parsing record IDs:", error);
      }
    }
  }, [searchParams, router]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRecordIds([]);
  };

  const handleSuccess = () => {
    handleClose();
    // Optionally refresh the page or show success message
    window.location.reload();
  };

  if (!isOpen || selectedRecordIds.length === 0) {
    return null;
  }

  return (
    <CreateCampaignDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      recordIds={selectedRecordIds}
      onSuccess={handleSuccess}
    />
  );
}
