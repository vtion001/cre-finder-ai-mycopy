"use client";

import { deleteFavoriteSearchAction } from "@/actions/search-history-actions";
import { formatNumber, formatSearchParams } from "@/lib/format";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { format } from "date-fns";
import { BookmarkIcon, PlayIcon, StarIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteSearchesProps {
  favoriteSearches: Array<
    Tables<"favorite_searches"> & {
      search_logs: Tables<"search_logs">;
    }
  >;
}

export function FavoriteSearches({ favoriteSearches }: FavoriteSearchesProps) {
  const router = useRouter();
  const [selectedFavorite, setSelectedFavorite] = useState<
    | (Tables<"favorite_searches"> & {
        search_logs: Tables<"search_logs">;
      })
    | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteFavorite = async () => {
    if (!selectedFavorite) return;

    try {
      await deleteFavoriteSearchAction({
        favoriteSearchId: selectedFavorite.id,
        revalidatePath: "/dashboard/history",
      });

      toast.success("Favorite search removed");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to remove favorite search");
    }
  };

  if (favoriteSearches.length === 0) {
    return (
      <div className="border rounded-md p-6 text-center">
        <StarIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <h3 className="text-lg font-medium">No favorite searches</h3>
        <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
          Save your most useful searches as favorites for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead className="w-[50%]">Search Parameters</TableHead>
              <TableHead className="text-right">Results</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {favoriteSearches.map((favorite) => (
              <TableRow key={favorite.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{favorite.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Saved on{" "}
                    {format(new Date(favorite.created_at!), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatSearchParams(favorite.search_logs.search_parameters)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">
                    {formatNumber(favorite.search_logs.result_count)} results
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedFavorite(favorite);
                        setIsDeleteDialogOpen(true);
                      }}
                      title="Remove from favorites"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Favorite Search</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{selectedFavorite?.name}" from
              your favorites? This won't delete the search from your history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFavorite}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
