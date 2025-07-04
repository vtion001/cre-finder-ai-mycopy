"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@v1/trpc/client";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export function ProcessingState({ assetType }: { assetType: string }) {
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.licenses.getAssetTypeLicenses.queryOptions(
      {
        assetTypeSlug: assetType,
      },
      {
        refetchInterval: 3000,
      },
    ),
  );

  useEffect(() => {
    if (!!data?.data && !!data.meta.assetType && !!data.meta.locations) {
      router.refresh();
    }
  }, [data, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="flex items-center space-x-3">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Processing Your Results</h3>
        <p className="text-muted-foreground max-w-md">
          We're gathering your property data. This usually takes 1-3 minutes.
        </p>
      </div>
    </div>
  );
}
