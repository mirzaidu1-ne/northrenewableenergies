import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST() {
  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/contact")
  revalidatePath("/services")
  revalidatePath("/projects")
  revalidatePath("/blog")
  revalidatePath("/quote")
  return NextResponse.json({ revalidated: true })
}
