import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient() as any

    const { error } = await supabase.from("contact_messages").insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      subject: body.subject || null,
      message: body.message,
      is_read: false,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
