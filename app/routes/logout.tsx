import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteSessionCookie, sessionCookie } from "~/cookies.server";
import { invalidateSession } from "~/lib/sessions";

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = (await sessionCookie.parse(cookieHeader)) || {};

  if (!sessionId) {
    throw redirect("/login");
  }

  invalidateSession(sessionId);

  deleteSessionCookie();

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionCookie.serialize("", { maxAge: -1 }),
    },
  });
};

export const loader = async () => redirect("/");
