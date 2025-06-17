import { IconFileUnknown } from "@tabler/icons-react";
import { Button } from "@v1/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 p-4">
      <div className="space-y-2">
        <IconFileUnknown className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <Search className="h-4 w-4 mr-2" />
            Search Properties
          </Link>
        </Button>
      </div>
    </div>
  );
}
