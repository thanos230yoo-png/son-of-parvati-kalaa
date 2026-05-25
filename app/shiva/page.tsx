"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShivaPage() {

  const [posts, setPosts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getPosts();
    checkAdmin();
  }, []);

  async function getPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "Shiva");

    setPosts(data || []);
  }
  async function checkAdmin() {

  const { data } = await supabase.auth.getUser();

  const email = data.user?.email;

  if (email === "thanos230yoo@gmail.com") {
    setIsAdmin(true);
  }

}
async function deletePost(id: number) {

  const confirmDelete = confirm("Delete this kalaa?");

  if (!confirmDelete) return;

  await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  getPosts();

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
  className="w-full max-h-[800px] object-contain bg-black"
/>

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {post.title}
              </h2>

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
              <button
  onClick={() => handleLike(post)}
  className="bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
>
  ❤️ {post.likes || 0}
</button>



            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
