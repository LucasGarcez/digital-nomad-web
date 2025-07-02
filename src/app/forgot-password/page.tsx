"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Check your email for a password reset link!");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </main>
    </div>
  );
}
