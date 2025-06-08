import { SearchLoading } from "@/components/search-loading";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 pb-16 space-y-6">
      <SearchLoading isEmpty />
    </div>
  );
}
