import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";

import MaxWidthWrapper from "~/components/ui/max-width-wrapper";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2 } from "lucide-react";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

import { sessionCookie } from "~/cookies.server";
import { login } from "~/actions/login";

const schema = z.object({
  email: z
    .string({ required_error: "Please enter your email. " })
    .email({ message: "Please enter your email. " })
    .min(5, { message: "Email must be at least 5 characters. " })
    .max(255, { message: "Email can only be 255 characters. " }),
  password: z
    .string({ required_error: "Please enter your password. " })
    .min(6, { message: "Password must be at least 6 characters. " })
    .max(255, { message: "Password can only be 255 characters. " }),
});

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
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

  return await login(formData);
}

export default function Login() {
  const message = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-between pt-5">
      <MaxWidthWrapper>
        <Card className="mx-auto w-full max-w-sm">
          <div className="flex w-full flex-col gap-2 text-foreground animate-in">
            <CardHeader>
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Enter your information to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form id={form.id} onSubmit={form.onSubmit} method="POST">
                <div className="grid gap-4">
                  <div className="grid gap-1">
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
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </div>
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
