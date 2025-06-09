"use client";

import { Button } from "@v1/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { ChevronDownIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface DateFilterPopoverProps<T extends FieldValues> {
  control: Control<T>;
  yearFieldName: FieldPath<T>;
  monthFieldName: FieldPath<T>;
  label: string;
  placeholder: string;
  className?: string;
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

export function DateFilterPopover<T extends FieldValues>({
  control,
  yearFieldName,
  monthFieldName,
  label,
  placeholder,
  className = "w-48",
}: DateFilterPopoverProps<T>) {
  // Get current values for display
  const yearValue = control._formValues[yearFieldName];
  const monthValue = control._formValues[monthFieldName];

  const getDisplayValue = () => {
    if (yearValue && monthValue !== null && monthValue !== undefined) {
      const date = new Date(yearValue, monthValue);
      return `Sold ${date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}+`;
    }
    return placeholder;
  };

  const hasValue = yearValue && monthValue !== null && monthValue !== undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`${className} justify-between`}
          type="button"
        >
          <span
            className={hasValue ? "text-foreground" : "text-muted-foreground"}
          >
            {getDisplayValue()}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{label}</Label>
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
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          )
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
