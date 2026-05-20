"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
export default function AdminPage() {

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  async function uploadPost() {

    const { error } = await supabase.from("posts").insert([
      {
        title,
        image,
        category,
      },
    ]);

    if (error) {
      alert("Upload failed ");
      console.log(error);
    } else {
      alert("Kalaa uploaded ");

      setTitle("");
      setImage("");
      setCategory("");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">

      <h1 className="text-5xl font-bold mb-10 text-purple-500">
        Admin Upload Panel
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-xl">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-900 p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="bg-zinc-900 p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-zinc-900 p-4 rounded-xl"
        />

        <button
          onClick={uploadPost}
          className="bg-purple-700 hover:bg-red-600 transition p-4 rounded-xl"
        >
          Upload Kalaa
        </button>

      </div>

    </main>
  );
}
