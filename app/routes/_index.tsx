import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/lib/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const { session, user } = await getUser(args);
  return { session, user };
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            {user ? user.name : "Log in or sign up to see your name!"}
          </h1>
        </header>
      </div>
    </div>
  );
}
