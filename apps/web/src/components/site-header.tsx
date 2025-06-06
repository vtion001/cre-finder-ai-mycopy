import type { ReactNode } from "react";

export async function SiteHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear ">
      <div className="flex w-full items-center gap-1 px-3 sm:px-6 ml-6 lg:gap-2 ">
        <h1 className="text-sm sm:text-base font-medium truncate">{title}</h1>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
