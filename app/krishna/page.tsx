"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function KrishnaPage() {

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
      .eq("category", "Krishna");

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

checkAdmin();

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <button
        onClick={() => window.location.href = "/"}
        className="fixed top-6 left-6 z-50 bg-zinc-900 px-4 py-2 rounded-full border border-pink-700 hover:bg-pink-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-6xl font-black text-center mb-16 text-pink-500">
        Krishna Kalaa
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

              <a
                href={post.image}
                download
                target="_blank"
                className="mt-4 inline-block bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
              >
                Download
              </a>
              <button
  onClick={async () => {

  const { data: userData } = await supabase.auth.getUser();

  const email = userData.user?.email;

  if (!email) {
    alert("Login first");
    return;
  }

  const { data: existingLike } = await supabase
    .from("liked_posts")
    .select("*")
    .eq("post_id", post.id)
    .eq("user_email", email)
    .single();

  if (existingLike) {
    alert("Already liked!");
    return;
  }

  await supabase
    .from("posts")
    .update({
      likes: Number(post.likes || 0) + 1
    })
    .eq("id", post.id);

  await supabase
    .from("liked_posts")
    .insert([
      {
        post_id: post.id,
        user_email: email
      }
    ]);

  getPosts();

}}
  className="bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
>
  ❤️ {post.likes || 0}
</button>
{isAdmin && (

  <button
    onClick={() => deletePost(post.id)}
    className="bg-red-700 hover:bg-red-900 px-4 py-2 rounded-xl"
  >
    Delete
  </button>

)}

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
