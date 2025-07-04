"use client";

import { FormControl, FormField, FormItem, FormMessage } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface InlineRangeFilterProps<T extends FieldValues> {
  control: Control<T>;
  minFieldName: FieldPath<T>;
  maxFieldName: FieldPath<T>;
  label: string;
  minValue?: number;
  maxValue?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export function InlineRangeFilter<T extends FieldValues>({
  control,
  minFieldName,
  maxFieldName,
  label,
  minValue,
  maxValue,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
}: InlineRangeFilterProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name={minFieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={minPlaceholder}
                  type="number"
                  min={minValue}
                  max={maxValue}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={maxFieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={maxPlaceholder}
                  type="number"
                  min={minValue}
                  max={maxValue}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
