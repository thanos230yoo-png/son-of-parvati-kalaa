"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

const [posts, setPosts] = useState<any[]>([]);

async function getPosts() {

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  setPosts(data || []);
}
async function checkUser() {

  const { data } = await supabase.auth.getUser();

  if (!data.user) {

    router.push("/login");

  }
}

useEffect(() => {

  checkUser();

  getPosts();

}, []);



  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<any>(null);
 

  async function uploadPost() {

    if (!image) {
      alert("Choose image first");
      return;
    }

    const fileName = `${Date.now()}-${image.name}`;

    // upload image

    const { error: imageError } = await supabase.storage
      .from("kalaa")
      .upload(fileName, image);

    if (imageError) {
      console.log(imageError);
      alert("Image upload failed");
      return;
    }

    // get public url

    const { data } = supabase.storage
      .from("kalaa")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // insert into database

    const { error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          image: imageUrl,
          category,
          tags,
        }
      ]);

    if (error) {
      console.log(error);
      alert("Database insert failed");
    } else {
      alert("Kalaa Uploaded 🔥");
      getPosts();
    }
  }

  return (

    <main className="min-h-screen bg-black text-white flex justify-center items-center px-6">

      <div className="w-full max-w-xl bg-zinc-950 border border-purple-900 rounded-3xl p-10 space-y-6">

        <h1 className="text-5xl font-black text-center bg-gradient-to-r from-purple-500 to-red-500 text-transparent bg-clip-text">
          Upload Kalaa
        </h1>

        {/* TITLE */}

        <input
          type="text"
          placeholder="Kalaa Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-900 p-4 rounded-xl outline-none"
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-zinc-900 p-4 rounded-xl outline-none"
        >

          <option value="">Choose Category</option>

          <option value="Durga">Durga</option>
          <option value="Kali">Kali</option>
          <option value="Shiva">Shiva</option>
          <option value="Krishna">Krishna</option>
          <option value="General">General</option>

        </select>
        <input
          type="text"
          placeholder="Search tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900"
        />
          
          
          
        

        {/* IMAGE */}

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full bg-zinc-900 p-4 rounded-xl"
        />

        {/* BUTTON */}

        <button
          onClick={uploadPost}
          className="w-full py-4 rounded-xl bg-purple-700 hover:bg-red-700 transition text-lg font-bold"
        >
          Upload Kalaa
        </button>

      </div>
      <div className="mt-20 w-full">

  <h2 className="text-4xl font-black mb-10 text-center text-red-500">
    Delete Kalaa
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

    {posts.map((post) => (

      <div
        key={post.id}
        className="bg-zinc-900 rounded-3xl overflow-hidden"
      >

        <img
          src={post.image}
          alt={post.title}
          className="w-full aspect-square object-cover"
        />

        <div className="p-5">

          <h2 className="text-2xl font-bold">
            {post.title}
          </h2>

          <button
            onClick={async () => {

              await supabase
                .from("posts")
                .delete()
                .eq("id", post.id);

              getPosts();

            }}
            className="mt-4 bg-red-700 hover:bg-red-900 px-4 py-2 rounded-xl"
          >
            Delete
          </button>

        </div>

      </div>

    ))}

  </div>

</div>

    </main>

  );
}
