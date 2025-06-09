import { env } from "@/env.mjs";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  tag: z.enum(["licenses", "records"]),
  id: z.string(),
});

const cacheTags = {
  licenses: ["licenses"],
  records: ["property_records"],
} as const;

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const apiKey = authHeader?.split("Bearer ")?.at(1);

  if (apiKey !== env.NEXT_CACHE_API_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 },
    );
  }

  const parsedBody = schema.safeParse(await req.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { tag, id } = parsedBody.data;

  if (!(tag in cacheTags)) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }

  for (const cacheTag of cacheTags[tag]) {
    console.log(`Revalidating tag: ${cacheTag}_${id}`);
    revalidateTag(`${cacheTag}_${id}`);
  }

  return NextResponse.json({ success: true });
}
