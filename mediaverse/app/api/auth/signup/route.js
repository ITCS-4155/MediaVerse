import { NextResponse } from "next/server";
import { createUser } from "../../../../lib/userStore";
import { setSession } from "../../../../lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: "All fields required." }, { status: 400 });
    }

    const user = await createUser({ name, email, password });
    await setSession(user);

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("SIGNUP_ERROR:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Signup failed." }, { status: 500 });
  }
}