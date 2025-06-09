"use client";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">No property records</h3>
      <p className="text-muted-foreground mt-1">
        Your exported property records will appear here.
      </p>
    </div>
  );
}

export function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">No property records</h3>
      <p className="text-muted-foreground mt-1">
        Your exported property records will appear here.
      </p>
    </div>
  );
}
