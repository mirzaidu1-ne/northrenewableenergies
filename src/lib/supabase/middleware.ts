import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@/auth"

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for login page and static assets
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Check auth using NextAuth
  const session = await auth()

  // If not authenticated and trying to access admin pages, redirect to login
  if (!session?.user && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
