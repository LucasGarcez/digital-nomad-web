"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/signin");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/signin");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center">
          <p className="text-lg">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Digital Nomad
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md">
            Your gateway to digital lifestyle
          </p>
          {user && (
            <p className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            onClick={handleSignOut}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6"
          >
            Sign Out
          </button>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-muted-foreground">
        <span>© 2025 Coffstack. All rights reserved.</span>
      </footer>
    </div>
  );
}
