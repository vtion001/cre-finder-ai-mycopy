import { Logo as BaseLogo } from "@v1/ui/logo";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo(props: LogoProps) {
  return (
    <BaseLogo
      {...props}
      LinkComponent={Link}
      ImageComponent={Image}
    />
  );
}
