import { redirect } from "@remix-run/node";

import { db } from "~/db/db";
import { userTable } from "~/db/schema";
import { eq } from "drizzle-orm";

import { Argon2id } from "oslo/password";
import { z } from "zod";

import { createSession, generateSessionToken } from "~/lib/sessions";
import { sessionCookie, setSessionTokenCookie } from "~/cookies.server";

export const loginSchema = z.object({
  email: z.string().email().min(5).max(255),
  password: z.string().min(6).max(255),
});

export async function login(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries());

  const { email, password } = loginSchema.parse(formObject);

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser.length == 0) {
    return redirect("/login?message=Incorrect username or password.");
  }

  const validPassword = await new Argon2id().verify(
    existingUser[0].password,
    password
  );

  if (!validPassword) {
    return redirect("/login?message=Incorrect username or password.");
  }

  const token = generateSessionToken();

  const session = await createSession(token, existingUser[0].id);

  await setSessionTokenCookie(
    session.id,
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionCookie.serialize(token),
    },
  });
}
