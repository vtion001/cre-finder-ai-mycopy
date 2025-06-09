"use client";

import { cn } from "@v1/ui/cn";
import { Input, type InputProps } from "@v1/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import {
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputProps extends InputProps {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function PhoneInput({
  className,
  value,
  onValueChange,
  ...rest
}: PhoneInputProps) {
  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "us",
      value,
      countries: defaultCountries,
      onChange: (data) => {
        onValueChange?.(data.phone);
      },
    });

  return (
    <div className="flex w-full items-center space-x-2">
      <Select
        defaultValue={country.iso2}
        onValueChange={(iso2) => setCountry(iso2)}
      >
        <SelectTrigger
          className={cn("w-20", className?.includes("h-12") && "h-12")}
        >
          <SelectValue asChild>
            <FlagImage iso2={country.iso2} className="h-4" />
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[240px] overflow-y-auto">
          {defaultCountries.map((c) => {
            const country = parseCountry(c);
            return (
              <SelectItem key={country.iso2} value={country.iso2}>
                <div className="flex items-center space-x-2">
                  <FlagImage iso2={country.iso2} className="h-4" />
                  <span>{country.name}</span>
                  <span className="opacity-60">+{country.dialCode}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Input
        className={cn(className)}
        ref={inputRef}
        type="tel"
        value={inputValue}
        onChange={handlePhoneValueChange}
        {...rest}
      />
    </div>
  );
}
