"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@/components/icons";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ArrowLeftIcon, } from "lucide-react";

export function AppSidebarSearch({
  user,
  chatType = "chat",
}: {
  user: User | undefined;
  chatType?: string;
}) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer text-blue-500 dark:text-white">
                PAM Vector Search
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarLinks />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}

function SidebarLinks() {
  return (
    <div className="flex flex-col gap-2 px-5 mt-6">
      <Link href="/chat">
        <div className="group/links flex flex-row text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer text-zinc-800 dark:text-white">
          <ArrowLeftIcon
            strokeWidth={0.9}
            className="ml-4 group-hover/links:ml-1 group-hover/links:text-blue-500"
          />{" "}
          <span className="ml-1 group-hover/links:ml-2">AI Chat</span>
        </div>
      </Link>
      <Link href="/rag">
        <div className="group/links flex flex-row text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer text-zinc-800 dark:text-white">
          <ArrowLeftIcon
            strokeWidth={0.9}
            className="ml-4 group-hover/links:ml-1 group-hover/links:text-blue-500"
          />{" "}
          <span className="ml-1 group-hover/links:ml-2">AI Chat with RAG</span>
        </div>
      </Link>
    </div>
  );
}
