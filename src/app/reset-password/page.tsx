"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "invalid">(
    "loading"
  );

  useEffect(() => {
    // Supabase uses hash fragments (#) instead of query parameters (?)
    // http://localhost:3000/reset-password#access_token=toke-values0&expires_at=1751457402&expires_in=3600&refresh_token=refresh-token-value&token_type=bearer&type=recovery

    // Get hash parameters from URL
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const hashParams = new URLSearchParams(hash);

    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const type = hashParams.get("type");
    // const token = hashParams.get("token");
    // const expires_at = hashParams.get("expires_at");
    // const expires_in = hashParams.get("expires_in");
    // const token_type = hashParams.get("token_type");

    if (type !== "recovery" || !access_token || !refresh_token) {
      setStatus("invalid");
      return;
    }

    supabase.auth
      .setSession({
        access_token: access_token,
        refresh_token: refresh_token,
      })
      .then(({ error }) => {
        if (error) setStatus("invalid");
        else setStatus("ready");
      });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center">
          <p className="text-lg">Loading...</p>
        </main>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center">
          <p className="text-lg text-red-600">Invalid or expired link.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-5"
          >
            Update Password
          </button>
        </form>
      </main>
    </div>
  );
}
