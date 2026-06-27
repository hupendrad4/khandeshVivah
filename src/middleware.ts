import { NextResponse } from "next/server"
import type { NextRequest, NextFetchEvent } from "next/server"

export default async function middleware(_request: NextRequest, _event: NextFetchEvent) {
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
