import { redirect } from "next/navigation";

export default function DashboardAliasPage({
  params,
}: {
  params: { segments?: string[] };
}) {
  const path = Array.isArray(params.segments) && params.segments.length > 0
    ? "/" + params.segments.join("/")
    : "";

  redirect(`/en/dashboard${path}`);
}


