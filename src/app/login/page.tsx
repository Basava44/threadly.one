"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Dummy login — just redirect to profile
    localStorage.setItem("threadly_logged_in", "true");
    router.push("/profile");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-center mb-2">Welcome Back</h1>
          <p className="text-sm text-foreground/50 text-center mb-8">
            Sign in to your threadly.one account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium tracking-wider text-[#8B7D3C] mb-1 block">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-warm border border-foreground/10 rounded text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium tracking-wider text-[#8B7D3C] mb-1 block">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-warm border border-foreground/10 rounded text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-foreground text-cream text-sm font-medium tracking-wider rounded hover:bg-foreground/90 transition-colors"
            >
              SIGN IN
            </button>
          </form>


          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-xs text-foreground/40">OR</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <button
            onClick={() => { localStorage.setItem("threadly_logged_in", "true"); router.push("/profile"); }}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-foreground/10 rounded text-sm font-medium hover:border-foreground/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-foreground/40 text-center mt-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-foreground/70 hover:text-foreground transition-colors">
              Create one
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
