import { createCookie, redirect } from "@remix-run/node";

export const sessionCookie = createCookie("session", {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionCookie.serialize(token, {
        expires: expiresAt,
      }),
    },
  });
}

export async function deleteSessionCookie() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionCookie.serialize("", { maxAge: -1 }),
    },
  });
}
