import { cn } from "../utils/cn";
import type { ReactNode } from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }>;
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
  }>;
}

export function Logo({
  className,
  showText = true,
  size = "md",
  href,
  LinkComponent,
  ImageComponent,
}: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 28 },
    md: { width: 130, height: 36 },
    lg: { width: 160, height: 44 },
  };

  const { width, height } = sizes[size];

  // Fallback to regular img if no ImageComponent provided
  const Image = ImageComponent || "img";

  const logo = (
    <div className={cn("flex items-center", className)}>
      {showText ? (
        <>
          <Image
            src="/images/logo.png"
            alt="CRE Finder AI Logo"
            width={width}
            height={height}
            className="h-auto w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/logo-dark.png"
            alt="CRE Finder AI Logo"
            width={width}
            height={height}
            className="h-auto w-auto hidden dark:block"
            priority
          />
        </>
      ) : (
        <Image
          src="/images/logo-icon.png"
          alt="CRE Finder AI"
          width={height}
          height={height}
          className="h-auto w-auto"
          priority
        />
      )}
      {showText === false && <span className="sr-only">CRE Finder AI</span>}
    </div>
  );

  if (href && LinkComponent) {
    return (
      <LinkComponent
        href={href}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {logo}
      </LinkComponent>
    );
  }

  return logo;
}
