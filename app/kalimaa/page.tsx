"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function KaliMaaPage() {

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "Kali");

    setPosts(data || []);
  }

  return (

    <main className="min-h-screen bg-black text-white p-10">
      

      {/* BACK BUTTON */}

      <button
        onClick={() => window.history.back()}
        className="fixed top-6 left-6 bg-zinc-900 px-4 py-2 rounded-full border border-purple-700 hover:bg-purple-700 transition"
      >
        ← Back
      </button>

      {/* TITLE */}

      <h1 className="text-6xl font-black text-center mb-16 text-purple-500">
        Kali Maa Kalaa
      </h1>

      {/* GALLERY */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {posts.map((post) => (

  <div
    key={post.id}
    className="bg-zinc-900 rounded-3xl overflow-hidden"
  >

    <img
      src={post.image}
      alt={post.title}
      className="w-full h-[500px] object-cover"
    />

    <div className="p-5">

      <h2 className="text-2xl font-bold">
        {post.title}
      </h2>

      <div className="flex gap-3 mt-4">

        <a
          href={post.image}
          download
          target="_blank"
          className="bg-purple-700 hover:bg-purple-900 px-4 py-2 rounded-xl"
        >
          Download
        </a>

        <button
          onClick={async () => {

            await supabase
              .from("posts")
              .update({
                likes: (post.likes || 0) + 1
              })
              .eq("id", post.id);

            getPosts();

          }}
          className="bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
        >
          ❤️ {post.likes || 0}
        </button>

        <button
          onClick={async () => {

            await supabase
              .from("posts")
              .delete()
              .eq("id", post.id);

            getPosts();

          }}
          className="bg-red-700 hover:bg-red-900 px-4 py-2 rounded-xl"
        >
          Delete
        </button>

      </div>

    </div>

  </div>

))}
      </div>

    </main>

  );
}