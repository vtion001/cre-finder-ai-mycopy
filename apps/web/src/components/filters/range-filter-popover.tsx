"use client";

import { Button } from "@v1/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface RangeFilterPopoverProps<T extends FieldValues> {
  control: Control<T>;
  minFieldName: FieldPath<T>;
  maxFieldName: FieldPath<T>;
  label: string;
  placeholder: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  formatDisplayValue?: (min?: number, max?: number) => string;
  className?: string;
}

export function RangeFilterPopover<T extends FieldValues>({
  control,
  minFieldName,
  maxFieldName,
  label,
  placeholder,
  unit = "",
  minValue,
  maxValue,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  formatDisplayValue,
  className = "w-48",
}: RangeFilterPopoverProps<T>) {
  // Get current values for display
  const minFieldValue = control._formValues[minFieldName];
  const maxFieldValue = control._formValues[maxFieldName];

  const getDisplayValue = () => {
    if (formatDisplayValue) {
      return formatDisplayValue(minFieldValue, maxFieldValue);
    }

    if (minFieldValue || maxFieldValue) {
      const minDisplay = minFieldValue ? minFieldValue.toLocaleString() : "0";
      const maxDisplay = maxFieldValue
        ? ` - ${maxFieldValue.toLocaleString()}`
        : "+";
      return `${minDisplay}${maxDisplay} ${unit}`.trim();
    }

    return placeholder;
  };

  const hasValue = minFieldValue || maxFieldValue;

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
        </div>
      </PopoverContent>
    </Popover>
  );
}
