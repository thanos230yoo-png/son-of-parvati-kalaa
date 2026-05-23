"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { error } from "console";

export default function AdminPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<any>(null);

  useEffect(() => {

    checkAdmin();
    

  }, []);

  async function checkAdmin() {

  const { data } = await supabase.auth.getUser();

  if (
    data.user?.email !== "thanos230yoo@gmail.com"
  ) {

    router.push("/");

    return;
  }

  await getPosts();
setLoading(false);
}

  async function getPosts() {

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("POSTS:", data);
  console.log("ERROR:", error);

  if (error) {
    console.log(error);
    return;
  }

  setPosts(data || []);
}
  

  async function uploadPost() {

    if (!image) {

      alert("Choose image first");

      return;
    }

    const fileName =
      `${Date.now()}-${image.name}`;

    const { error: imageError } =
      await supabase.storage
        .from("kalaa")
        .upload(fileName, image);

    if (imageError) {

      console.log(imageError);

      alert("Image upload failed");

      return;
    }

    const { data } =
      supabase.storage
        .from("kalaa")
        .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    const { error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          image: imageUrl,
          category,
          tags,
          likes: 0,
        },
      ]);

    if (error) {

      console.log(error);

      alert(error.message);

      return;
    }


    alert("Kalaa Uploaded 🔥");

    setTitle("");
    setCategory("");
    setTags("");
    setImage(null);

    getPosts();
  }
  

  async function deletePost(id: number) {

    const confirmDelete =
      confirm("Delete this kalaa?");

    if (!confirmDelete) return;

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    getPosts();
  }

  if (loading) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center text-5xl">

        Loading...

      </main>

    );

  }
<div className="mt-20">

  <h2 className="text-5xl font-bold text-center text-purple-500 mb-10">
    Uploaded Kalaa
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    
    {posts.map((post) => (
      <div
        key={post.id}
        className="bg-black/60 border border-purple-900 rounded-3xl overflow-hidden"
      >

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-56 object-cover"
        />

        <div className="p-4">

          <h3 className="text-2xl font-bold text-white mb-2">
            {post.title}
          </h3>

          <p className="text-gray-400 mb-4">
            {post.category}
          </p>

          <div className="flex gap-3">

            <button
              onClick={() => deletePost(post.id)}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-xl text-white font-bold"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    ))}

  </div>

</div>
  return (

    <main className="min-h-screen bg-black text-white p-10">

      {/* TITLE */}

      <h1 className="text-6xl font-black text-center mb-16 text-purple-500">

        GOD ADMIN PANEL

      </h1>

      {/* UPLOAD PANEL */}

      <div className="bg-zinc-900 rounded-3xl p-8 mb-20 max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold mb-8">

          Upload Kalaa

        </h2>

        <div className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="bg-black p-4 rounded-xl"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="bg-black p-4 rounded-xl"
          >

            <option value="">
              Choose Category
            </option>

            <option value="Kali">
              Kali
            </option>

            <option value="Durga">
              Durga
            </option>

            <option value="Krishna">
              Krishna
            </option>

            <option value="Shiva">
              Shiva
            </option>

            <option value="General">
              General
            </option>

          </select>

          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) =>
              setTags(e.target.value)
            }
            className="bg-black p-4 rounded-xl"
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(
                e.target.files?.[0] || null
              )
            }
            className="bg-black p-4 rounded-xl"
          />

          <button
            onClick={uploadPost}
            className="bg-purple-700 hover:bg-purple-900 p-4 rounded-xl font-bold"
          >

            Upload Kalaa

          </button>

        </div>

      </div>

      {/* POSTS */}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">

        {posts.map((post) => (

          <div
            key={post.id}
            className="bg-zinc-900 rounded-3xl overflow-hidden break-inside-avoid mb-8"
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

              <p className="text-zinc-400 mt-2">

                {post.category}

              </p>

              <p className="text-pink-400 mt-2">

                ❤️ {post.likes || 0}

              </p>

              <button
                onClick={() =>
                  deletePost(post.id)
                }
                className="bg-red-700 hover:bg-red-900 px-4 py-2 rounded-xl mt-4"
              >

                Delete

              </button>

            </div>

          </div>

        ))}

      </div>

    </main>

  );
}
