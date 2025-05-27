"use client";

import { RangeSlider } from "@v1/ui/slider";
import { FormControl, FormField, FormItem, FormMessage } from "@v1/ui/form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface RangeSliderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  minName: TName;
  maxName: TName;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  disabled?: boolean;
}

export function RangeSliderField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  minName,
  maxName,
  label,
  min = 0,
  max = 100,
  step = 1,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  disabled = false,
}: RangeSliderFieldProps<TFieldValues, TName>) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{label}</h3>
      <FormField
        control={control}
        name={minName}
        render={({ field: minField }) => (
          <FormField
            control={control}
            name={maxName}
            render={({ field: maxField }) => (
              <FormItem>
                <FormControl>
                  <RangeSlider
                    value={[minField.value, maxField.value]}
                    onValueChange={([newMin, newMax]) => {
                      minField.onChange(newMin);
                      maxField.onChange(newMax);
                    }}
                    min={min}
                    max={max}
                    step={step}
                    minPlaceholder={minPlaceholder}
                    maxPlaceholder={maxPlaceholder}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      />
    </div>
  );
}
