import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import MaxWidthWrapper from "~/components/ui/max-width-wrapper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

import { signup } from "~/actions/signup";
import { sessionCookie } from "~/cookies.server";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
  firstname: z.string().trim().min(1).max(255),
  lastname: z.string().trim().min(1).max(255),
});

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const sessionId = (await sessionCookie.parse(cookieHeader)) || null;

  if (sessionId !== null) {
    throw redirect("/");
  }

  const message = new URL(request.url).searchParams.get("message");

  return message;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return await signup(formData);
}

export default function Signup() {
  const message = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <main className="mx-auto flex max-w-7xl items-center justify-between pt-5">
      <MaxWidthWrapper>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form id={form.id} onSubmit={form.onSubmit} method="POST">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstname">First name</Label>
                    <Input
                      type="text"
                      name={fields.firstname.name}
                      placeholder="Johnny"
                    />
                    {fields.firstname && fields.firstname.errors && (
                      <div className="text-[0.8rem] font-medium text-destructive">
                        {fields.firstname.errors}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input
                      type="text"
                      name={fields.lastname.name}
                      placeholder="Appleseed"
                    />
                    {fields.lastname && fields.lastname.errors && (
                      <div className="text-[0.8rem] font-medium text-destructive">
                        {fields.lastname.errors}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name={fields.email.name}
                    placeholder="you@example.com"
                  />
                  {fields.email && fields.email.errors && (
                    <div className="text-[0.8rem] font-medium text-destructive">
                      {fields.email.errors}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name={fields.password.name}
                    placeholder="••••••••"
                  />
                  {fields.password && fields.password.errors && (
                    <div className="text-[0.8rem] font-medium text-destructive">
                      {fields.password.errors}
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={navigation.state === "submitting"}
                >
                  {navigation.state === "submitting" ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
        {message && (
          <div className="mx-auto w-full max-w-sm p-5 mt-5 rounded-lg border border-slate-200 bg-destructive shadow-sm dark:border-slate-800 dark:bg-destructive/50 text-slate-50">
            <div className="text-[0.8rem] font-medium">{message}</div>
          </div>
        )}
      </MaxWidthWrapper>
    </main>
  );
}
