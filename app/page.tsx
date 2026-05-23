"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {

  const [posts, setPosts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<any>(null);

  useEffect(() => {

    getPosts();
    checkAdmin();

  }, []);

  async function checkAdmin() {

    const { data } = await supabase.auth.getUser();

    if (data.user?.email === "thanos230yoo@gmail.com") {

      setIsAdmin(true);

    }
  }

  async function getPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    setPosts(data || []);
  }

  async function deletePost(id: number) {

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    getPosts();
  }

  async function uploadPost() {

    if (!image) {

      alert("Choose image first");
      return;
    }

    const fileName = `${Date.now()}-${image.name}`;

    const { error: imageError } = await supabase.storage
      .from("kalaa")
      .upload(fileName, image);

    if (imageError) {

      console.log(imageError);

      alert("Image upload failed");

      return;
    }

    const { data } = supabase.storage
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
          tags: tags || "",
          likes: 0,
        }
      ]);

    if (error) {

      console.log(error);

      alert(error.message);

    } else {

      alert("Kalaa Uploaded 🔥");

      setTitle("");
      setCategory("");
      setTags("");
      setImage(null);

      getPosts();
    }
  }

  async function handleLike(id: number) {

  const post = posts.find((p) => p.id === id);

  if (!post) return;

  const alreadyLiked = localStorage.getItem(`liked-${id}`);

  if (alreadyLiked) {
    alert("Already liked!");
    return;
  }

  const { error: insertError } = await supabase
    .from("liked_posts")
    .insert([
      {
        post_id: id,
      },
    ]);

  if (insertError) {
    console.log(insertError);
    alert("Unable to save like");
    return;
  }

  const newLikeCount = (post.likes || 0) + 1;

  const { error: updateError } = await supabase
    .from("posts")
    .update({
      likes: newLikeCount,
    })
    .eq("id", id);

  if (updateError) {
    console.log(updateError);
    alert("Unable to update likes");
    return;
  }

  localStorage.setItem(`liked-${id}`, "true");

  await getPosts();
}
    

  const kalaas = [

    {
      title: "Kali Maa",
      image: "/kalii.png",
    },

    {
      title: "Shiva",
      image: "/shiva.png",
    },

    {
      title: "Krishna",
      image: "/krishnananba.png",
    },

    {
      title: "Durga Maa",
      image: "/durgama.png",
    },

  ];

  const filteredKalaas = kalaas.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <main className="min-h-screen text-white relative overflow-x-hidden flex flex-col items-center">

      <div className="fixed inset-0 -z-10">

        <img
          src="/background.jpg"
          alt="background"
          className="w-full h-full object-cover opacity-30"
        />

      </div>

      <div className="w-full text-center py-10">

        <h1 className="text-6xl md:text-8xl font-black text-center bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
          SON OF PARVATI'S KALAA
        </h1>

        <p className="text-red-500 mt-4 text-lg">
          KALAA ARCHIVE
        </p>

      </div>

      <div className="flex items-center gap-3 mt-8">

        <input
          type="text"
          placeholder="Search kalaa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[600px] max-w-[90vw] bg-zinc-900 border border-red-800 rounded-full px-6 py-3 text-white outline-none"
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 w-[90%] max-w-6xl">

        {(search ? filteredKalaas : kalaas).map((item) => (

          <div
            key={item.title}
            className="bg-black/70 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden"
          >

            <img
              src={item.image}
              alt={item.title}
              className="w-full aspect-square object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {item.title}
              </h2>

              <div className="flex gap-3 mt-4">

                <Link
                  href={`/${item.title.toLowerCase().replace(" ", "")}`}
                  className="px-5 py-2 rounded-full bg-purple-700"
                >
                  View Kalaa
                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

      
      <div className="mt-20 w-[90%] max-w-6xl">

        <h1 className="text-4xl font-bold text-center mb-10 text-purple-500">
          Uploaded Kalaa
        </h1>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">

          {posts.map((post) => (

            <div
              key={post.id}
              className="bg-zinc-900 rounded-3xl overflow-hidden break-inside-avoid mb-8"
            >

              <a
                href={post.image}
                target="_blank"
              >

                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full max-h-[800px] object-contain bg-black"
                />

              </a>

              <div className="p-5">

                <h2 className="text-2xl font-bold">
                  {post.title}
                </h2>

                <p className="text-zinc-400 mt-2">
                  {post.category}
                </p>

                <div className="flex gap-4 mt-4 flex-wrap">

                  <button
                    onClick={() => handleLike(post.id)}
                    className="bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
                  >
                    ❤️ {post.likes || 0}
                  </button>

                  <button
  onClick={async () => {
    const response = await fetch(post.image);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.title}.png`;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }}
  className="bg-purple-700 hover:bg-purple-900 px-4 py-2 rounded-xl"
>
  Download
</button>

                  {isAdmin && (

                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-700 px-4 py-2 rounded-xl"
                    >
                      Delete
                    </button>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="py-20 text-zinc-500 text-sm">
        Son Of Parvati • Kalaa Archive
      </div>

    </main>
  );
}
