"use client";

import { saveSearchAsFavoriteAction } from "@/actions/search-history-actions";
import { Button } from "@v1/ui/button";

// Use a more generic type for the search log
interface SearchLog {
  id: string;
  // Allow any additional properties without using 'any'
  [key: string]: string | number | boolean | object | null | undefined;
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SaveAsFavoriteDialogProps {
  searchLog: SearchLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveAsFavoriteDialog({
  searchLog,
  open,
  onOpenChange,
}: SaveAsFavoriteDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAsFavorite = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for this favorite search");
      return;
    }

    setIsSubmitting(true);

    try {
      await saveSearchAsFavoriteAction({
        searchLogId: searchLog.id,
        name: name.trim(),
        revalidatePath: "/dashboard/history",
      });

      toast.success("Search saved to favorites");
      onOpenChange(false);
      setName("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save search as favorite");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            Save Search as Favorite
          </DialogTitle>
          <DialogDescription>
            Give this search a name so you can easily find it later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="favorite-name">Favorite Name</Label>
            <Input
              id="favorite-name"
              placeholder="e.g., Office Buildings in Downtown"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setName("");
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAsFavorite}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save to Favorites"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
