import { Link } from "@remix-run/react";
import { User } from "~/db/schema";
import UserAccountNav from "./user-account-nav";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import MaxWidthWrapper from "../ui/max-width-wrapper";

export default function Navbar({ user }: { user?: User }) {
  return (
    <MaxWidthWrapper>
      <nav className="sticky h-14 px-5 inset-x-0 top-0 z-30 w-full border-b border-gray-200 light:bg-white/75 backdrop-blur-lg transition-all">
        <div className="flex h-14 items-center align-middle justify-between border-b border-zinc-200">
          <div className="flex items-center gap-x-4">
            <Link to="/" className="flex z-40 font-semibold">
              <span>Remix Auth Example</span>
            </Link>
          </div>
          {user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link to="/login">
              <Button className="flex flex-row justify-between px-3">
                <p className="space-y-2 text-sm">Get Started</p>
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </MaxWidthWrapper>
  );
}
