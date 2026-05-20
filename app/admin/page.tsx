"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
export default function AdminPage() {

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>(null);
  const [category, setCategory] = useState("");

  async function uploadPost() {

  if (!image) {
    alert("Choose image first");
    return;
  }

  const fileName = `${Date.now()}-${image.name}`;

  // upload image to supabase storage
  const { data: imageData, error: imageError } = await supabase.storage
    .from("kalaa")
    .upload(fileName, image);

  if (imageError) {
    console.log(imageError);
    alert("Image upload failed");
    return;
  }

  // get public image url
  const { data: publicUrlData } = supabase.storage
    .from("kalaa")
    .getPublicUrl(fileName);

  const imageUrl = publicUrlData.publicUrl;

  // save post to database
  const { data: insertData, error } = await supabase
  .from("posts")
  .insert([
    {
      title: title,
      image: imageUrl,
      category: category,
    },
  ])
  .select();

console.log(insertData);
console.log(error);

  if (error) {
    console.log(error);
    alert("Database insert failed");
  } else {
    alert("Kalaa uploaded successfully 🔥");
  }
}
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">

      <h1 className="text-5xl font-bold mb-10 text-purple-500">
        Admin Upload Panel
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-xl">

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
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
