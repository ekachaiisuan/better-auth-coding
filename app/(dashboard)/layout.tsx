'use client'

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  return (
    <div className="w-full min-w-dvw min-h-dvh bg-white overflow-hidden">
      <nav className="w-full flex justify-end items-center pr-6 h-16 shadow-lg mx-auto max-w-7xl mb-6 overflow-hidden bg-neutral-50 rounded-md">
        <Button
          onClick={async () => { await authClient.signOut(); router.push("/sign-in") }}
          className="cursor-pointer"
        >Sign Out</Button>
      </nav>
      {children}
    </div>
  );
}
