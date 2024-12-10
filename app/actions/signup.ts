import { redirect } from "@remix-run/node";

import { db } from "~/db/db";
import { userTable } from "~/db/schema";

import { Argon2id } from "oslo/password";
import { z } from "zod";

import { createSession, generateSessionToken } from "~/lib/sessions";
import { sessionCookie, setSessionTokenCookie } from "~/cookies.server";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  firstname: z.string().trim().min(1).max(255),
  lastname: z.string().trim().min(1).max(255),
});

export async function signup(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries());

  const { firstname, lastname, email, password } =
    signupSchema.parse(formObject);

  const hashedPassword = await new Argon2id().hash(password);
  const userId = crypto.randomUUID();

  try {
    await db.insert(userTable).values({
      id: userId,
      name: firstname + " " + lastname,
      email: email,
      password: hashedPassword,
    });

    const token = generateSessionToken();

    const session = await createSession(token, userId);

    setSessionTokenCookie(
      session.id,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    );

    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionCookie.serialize(token),
      },
    });
  } catch (e) {
    console.log(e);
    return {
      error: "An unknown error occurred",
    };
  }
}
