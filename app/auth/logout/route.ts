import { NextRequest } from "next/server";

export async function POST(_: NextRequest) {
  // Clear the token cookie
  const cookie = `token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
}
