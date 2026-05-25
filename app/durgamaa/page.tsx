"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DurgaMaaPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  async function checkAdmin() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setIsAdmin(true);
    }
  }

  async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  const filtered =
    data?.filter((post) =>
      post.title?.toLowerCase().includes("durga") ||
      post.category?.toLowerCase().includes("durga")
    ) || [];

  setPosts(filtered);
}

  async function handleLike(post: any) {

  let userId = localStorage.getItem("user_id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("user_id", userId);
  }

  // CHECK EXISTING LIKE

  const { data: existingLike } = await supabase
    .from("liked_posts")
    .select("*")
    .eq("post_id", post.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    alert("Already liked!");
    return;
  }

  // INSERT LIKE RECORD

  const { error: insertError } = await supabase
    .from("liked_posts")
    .insert([
      {
        post_id: post.id,
        user_id: userId,
      },
    ]);

  if (insertError) {
    console.log(insertError);
    return;
  }

  // GET CURRENT REAL LIKE COUNT FROM DATABASE

  const { data: currentPost } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", post.id)
    .single();

  const currentLikes = currentPost?.likes || 0;

  // UPDATE USING REAL DATABASE VALUE

  await supabase
    .from("posts")
    .update({
      likes: currentLikes + 1,
    })
    .eq("id", post.id);

  // REFRESH POSTS

  getPosts();
}
  async function deletePost(id: number) {
    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    getPosts();
  }

  useEffect(() => {
    getPosts();
    checkAdmin();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      {/* BACK BUTTON */}

      <button
        onClick={() => (window.location.href = "/")}
        className="fixed top-6 left-6 z-50 bg-zinc-900 px-4 py-2 rounded-full border border-red-700 hover:bg-red-700 transition"
      >
        ← Back
      </button>

      {/* TITLE */}

      <h1 className="text-6xl font-black text-center mb-16 text-red-500">
        Durga Maa Kalaa
      </h1>

      {/* EMPTY */}

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
            {/* CLICKABLE IMAGE */}

            <a href={post.image} target="_blank">
              <img
                src={post.image_url || post.image}
                alt={post.title}
                className="w-full max-h-[800px] object-contain bg-black hover:scale-105 transition duration-300"
              />
            </a>

            <div className="p-5">
              <h2 className="text-2xl font-bold">
                {post.title}
              </h2>

              <div className="flex gap-3 mt-4 flex-wrap">
                {/* LIKE */}

                <button
                  onClick={() => handleLike(post)}
                  className="bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
                >
                  ❤️ {post.likes || 0}
                </button>

               <button
  onClick={async () => {

    const imageUrl = post.image_url || post.image;

    const response = await fetch(imageUrl);

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${post.title}.jpg`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

  }}
  className="bg-purple-700 hover:bg-purple-900 px-4 py-2 rounded-xl"
>
  Download
</button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
