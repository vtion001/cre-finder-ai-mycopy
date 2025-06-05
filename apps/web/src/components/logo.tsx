import { cn } from "@v1/ui/cn";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className,
  href = "/",
  showText = true,
  size = "md",
}: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 28 },
    md: { width: 130, height: 36 },
    lg: { width: 160, height: 44 },
  };

  const { width, height } = sizes[size];

  const logo = (
    <div className={cn("flex items-center", className)}>
      {showText ? (
        <>
          <Image
            src="/images/logo.png"
            alt="CREQfinder Logo"
            width={width}
            height={height}
            className="h-auto w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/logo-dark.png"
            alt="CREQfinder Logo"
            width={width}
            height={height}
            className="h-auto w-auto hidden dark:block"
            priority
          />
        </>
      ) : (
        <Image
          src="/images/logo-icon.png"
          alt="CREQfinder"
          width={height}
          height={height}
          className="h-auto w-auto"
          priority
        />
      )}
      {showText === false && <span className="sr-only">CREQfinder</span>}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {logo}
      </Link>
    );
  }

  return logo;
}
