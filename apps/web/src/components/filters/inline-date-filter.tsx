"use client";

import { FormControl, FormField, FormItem, FormMessage } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface InlineDateFilterProps<T extends FieldValues> {
  control: Control<T>;
  yearFieldName: FieldPath<T>;
  monthFieldName: FieldPath<T>;
  label: string;
}

const MONTHS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

export function InlineDateFilter<T extends FieldValues>({
  control,
  yearFieldName,
  monthFieldName,
  label,
}: InlineDateFilterProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={control}
          name={monthFieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  value={field.value?.toString() ?? ""}
                  onValueChange={(value) =>
                    field.onChange(value === "" ? undefined : Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={yearFieldName}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
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
