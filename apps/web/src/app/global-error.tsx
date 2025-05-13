"use client";

import NextError from "next/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <NextError statusCode={0} />;
}
