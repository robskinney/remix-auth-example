import { Form, Link } from "@remix-run/react";
import { User } from "~/db/schema";

import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

import {
  LogOut,
  MessageCircle,
  Cog,
  Calendar,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import blankprofile from "~/images/blank-profile.png";

export default function UserAccountNav({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Card className="flex h-10 w-20 items-center justify-between rounded-3xl px-2.5 transition-all duration-100 hover:shadow-md">
          <Menu className="flex" size={20} />
          <Avatar className="flex aspect-square h-8 w-8 cursor-pointer rounded-full bg-slate-400 transition-all">
            <AvatarImage
              className="h-[3] w-[3]"
              src={blankprofile}
              alt={`${user.name} profile picture`}
            />
          </Avatar>
        </Card>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="light:bg-white" align="end">
        <div className="p-0.5 text-xs">{user.email}</div>

        <DropdownMenuSeparator />

        <Form action="/logout" method="POST" navigate={false}>
          <Button
            type="submit"
            variant="ghost"
            size={null}
            className="w-full justify-start"
          >
            <DropdownMenuItem className="cursor-pointer text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </Button>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
