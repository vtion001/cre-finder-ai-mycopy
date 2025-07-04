import { env } from "@/env.mjs";
import { getMarketingUrl } from "@v1/utils/environment";
import { redirect } from "next/navigation";

export const metadata = {
  title: "CREFinderAI",
};

export default async function Marketing() {
  const url = getMarketingUrl();

  return redirect(url);
}
