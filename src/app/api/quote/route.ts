import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("leads").insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      property_type: body.propertyType || null,
      monthly_bill: body.monthlyBill ? Number(body.monthlyBill) : null,
      message: body.message || null,
      status: "new",
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
