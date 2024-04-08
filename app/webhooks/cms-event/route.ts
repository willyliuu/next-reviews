import { CACHE_TAG_REVIEWS } from "@/lib/review";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const payload = await request.json()
  if (payload.model === 'review') {
    revalidateTag(CACHE_TAG_REVIEWS)
    console.log('revalidated:', CACHE_TAG_REVIEWS)
  }
  console.log("payload:", payload)
  return new Response(null, { status: 204 })
}