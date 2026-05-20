"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DurgaMaaPage() {

  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "Durga");

    setPosts(data || []);
  }

  async function deletePost(id: number) {

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    getPosts();
  }

  return (

    <main className="min-h-screen bg-black text-white p-10">

      {/* BACK BUTTON */}

      <button
        onClick={() => window.location.href = "/"}
        className="fixed top-6 left-6 z-50 bg-zinc-900 px-4 py-2 rounded-full border border-red-700 hover:bg-red-700 transition"
      >
        ← Back
      </button>

      {/* TITLE */}

      <h1 className="text-6xl font-black text-center mb-16 text-red-500">
        Durga Maa Kalaa
      </h1>

      

      {/* EMPTY MESSAGE */}

      {posts.length === 0 && (

        <p className="text-center text-zinc-500 text-2xl mb-10">
          No uploaded kalaa yet...
        </p>

      )}

      {/* GALLERY */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">

        {posts.map((post) => (

          <div
            key={post.id}
            className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
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
                  onClick={() => deletePost(post.id)}
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
