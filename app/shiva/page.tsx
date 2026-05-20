"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShivaPage() {

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "Shiva");

    setPosts(data || []);
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <button
        onClick={() => window.location.href = "/"}
        className="fixed top-6 left-6 z-50 bg-zinc-900 px-4 py-2 rounded-full border border-blue-700 hover:bg-blue-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-6xl font-black text-center mb-16 text-blue-500">
        Shiva Kalaa
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {posts.map((post) => (

          <div
            key={post.id}
            className="bg-zinc-900 rounded-3xl overflow-hidden"
          >

            <img
              src={post.image}
              alt={post.title}
              className="w-full h-[500px] object-cover hover:scale-105 transition duration-300"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {post.title}
              </h2>

              <a
                href={post.image}
                download
                target="_blank"
                className="mt-4 inline-block bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-xl"
              >
                Download
              </a>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
