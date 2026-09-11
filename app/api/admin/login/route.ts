import { NextResponse } from "next/server";

import {
  createAdminSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password");
  if (typeof password !== "string" || !(await verifyAdminPassword(password))) {
    return NextResponse.redirect(
      new URL("/admin/login?error=1", request.url),
      303,
    );
  }
  const token = await createAdminSessionToken();
  const response = NextResponse.redirect(new URL("/admin", request.url), 303);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
  return response;
}
