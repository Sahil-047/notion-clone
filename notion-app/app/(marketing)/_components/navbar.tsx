"use client";

import { useScrollTop } from "@/hook/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();
    interface NavbarProps {
        isCollapsed: boolean;
        onResetWidth: () => void;
    }


    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between
            w-full flex items-center gap-x-2">
                {isLoading && (
                    <Spinner />
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button>
                                Log in
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button>
                                Take a tour for free
                            </Button>
                        </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button asChild>
                            <Link href="/documents">
                                Enter Notion
                            </Link>
                        </Button>

                        <UserButton
                            afterSignOutUrl="/"
                        />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    )
}