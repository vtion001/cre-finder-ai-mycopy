import { redirect } from "next/navigation";

export const metadata = {
  title: "CREFinderAI",
};

export default async function Marketing() {
  return redirect("https://crefinder.ai");
}
