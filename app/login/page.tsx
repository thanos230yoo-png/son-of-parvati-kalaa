"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed 😭🔥");
      return;
    }

    alert("Logged in 😭🔥");

    router.push("/admin");
  }

  return (

    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">

      <h1 className="text-5xl font-black text-purple-500">
        Admin Login
      </h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-zinc-900 p-4 rounded-xl w-[300px]"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-zinc-900 p-4 rounded-xl w-[300px]"
      />

      <button
        onClick={login}
        className="bg-purple-700 hover:bg-purple-900 px-8 py-3 rounded-xl"
      >
        Login
      </button>

    </main>
  );
}
