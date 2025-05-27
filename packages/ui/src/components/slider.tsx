"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "../utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

// Range Slider Component that combines slider with text inputs
interface RangeSliderProps {
  value?: [number | undefined, number | undefined];
  onValueChange?: (value: [number | undefined, number | undefined]) => void;
  min?: number;
  max?: number;
  step?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      value = [undefined, undefined],
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      minPlaceholder = "Min",
      maxPlaceholder = "Max",
      className,
      disabled = false,
    },
    ref,
  ) => {
    const [minValue, maxValue] = value;

    // Convert undefined values to min/max for slider
    const sliderValue = [minValue ?? min, maxValue ?? max];

    const handleSliderChange = (newValue: number[]) => {
      const [newMin, newMax] = newValue;
      onValueChange?.([
        newMin === min ? undefined : newMin,
        newMax === max ? undefined : newMax,
      ]);
    };

    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = e.target.value === "" ? undefined : Number(e.target.value);
      onValueChange?.([newMin, maxValue]);
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = e.target.value === "" ? undefined : Number(e.target.value);
      onValueChange?.([minValue, newMax]);
    };

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Text Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder={minPlaceholder}
            value={minValue ?? ""}
            onChange={handleMinInputChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <input
            type="number"
            placeholder={maxPlaceholder}
            value={maxValue ?? ""}
            onChange={handleMaxInputChange}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Slider */}
        <div className="px-2">
          <SliderPrimitive.Root
            value={sliderValue}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className="relative flex w-full touch-none select-none items-center"
          >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
          </SliderPrimitive.Root>
        </div>

        {/* Value Display */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      </div>
    );
  },
);
RangeSlider.displayName = "RangeSlider";

export { Slider, RangeSlider };
