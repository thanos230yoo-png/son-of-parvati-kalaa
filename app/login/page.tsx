"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed");
    } else {
      alert("Welcome Admin 🔥");
      window.location.href = "/admin";
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-3xl w-full max-w-md flex flex-col gap-5">

        <h1 className="text-4xl font-bold text-purple-500 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black p-4 rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-black p-4 rounded-xl"
        />

        <button
          onClick={login}
          className="bg-purple-700 hover:bg-red-600 transition p-4 rounded-xl"
        >
          Login
        </button>

      </div>

    </main>
  );
}
