"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

useEffect(() => {
  getPosts();
}, []);

async function getPosts() {

  const { data } = await supabase
    .from("posts")
    .select("*");

  setPosts(data || []);
}
  const [search, setSearch] = useState("")
  const kalaas = [
  {
    title: "Kali Maa",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },

  {
    title: "Shiva",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  },

  {
    title: "Krishna",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  },

  {
    title: "Durga Maa",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
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

      {/* HEADER */}
      <div className="w-full text-center py-10">
       <h1 className="text-6xl md:text-8xl font-black text-center bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 text-transparent bg-clip-text">
         SON OF PARVATI'S KALAA
       </h1>

        <p className="text-red-500 mt-4 text-lg">
          KALAA ARCHIVE
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3 mt-8">

        <input
          type="text"
          placeholder="Search kalaa, edits, wallpapers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[600px] bg-zinc-900 border border-red-800 rounded-full px-6 py-3 text-white outline-none"
        />

        <button
          className="px-5 py-3 rounded-full bg-purple-700 hover:bg-red-600 transition"
        >
          🔍
        </button>

      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 px-6">

        {[
          "Shiva",
          "Kali",
          "Krishna",
          "Parvati",
          "Bhairava",
          "Aghora",
          "Wallpapers",
          "AMVs",
          "Spiritual Edits",
          "Cosmic"
        ].map((item) => (
          <button
            key={item}
            className="px-5 py-2 rounded-full bg-zinc-900 border border-purple-700 hover:border-red-500 transition"
          >
            {item}
          </button>
        ))}
      </div>
      {/* NAVBAR */}

<div className="w-full flex justify-center gap-6 mt-10 text-zinc-300">

  <Link href="/kalimaa" className="hover:text-purple-400 transition">
    Kali Maa
  </Link>

  <Link href="/shiva" className="hover:text-blue-400 transition">
    Shiva
  </Link>

  <Link href="/krishna" className="hover:text-pink-400 transition">
    Krishna
  </Link>

</div>

      {/* HERO IMAGE */}
      <div className="mt-20 text-center">

        <div className="text-purple-500 text-xl tracking-[8px] uppercase mb-4">
          Divine Archive
        </div>

        <h2 className="text-5xl font-bold mb-6">
          Explore Spiritual Kalaa
        </h2>

        <p className="text-zinc-500 max-w-2xl mx-auto">
          A cinematic archive of divine aesthetics, cosmic visuals,
          wallpapers, AMVs, spiritual edits, and sacred expression.
        </p>

       </div>
      {/* GALLERY */}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 w-[90%] max-w-6xl">

  {(() => {

    const kalaas = [

      {
        title: "Kali Maa",
        image:
          "https://kali.png",
      },

      {
        title: "Shiva",
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      },

      {
        title: "Krishna",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      },

      {
        title: "Durga Maa",
        image:
          "/durgamaa.png",
      },

    ];

    const filteredKalaas = kalaas.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
      search ? (
        filteredKalaas.slice(0, 1).map((item) => (

          <div
            key={item.title}
            className="bg-black/70 backdrop-blur-sm border border-purple-500 rounded-3xl overflow-hidden"
          >

            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[500px] object-cover"
            />

            <div className="p-5">

              <h2 className="text-3xl font-bold">
                {item.title}
              </h2>

              <Link
                href={`/${item.title.toLowerCase().replace(" ", "")}`}
                className="mt-4 inline-block px-5 py-3 rounded-full bg-purple-700 hover:bg-red-600 transition"
              >
                Open Kalaa
              </Link>

            </div>

          </div>

        ))
      ) : (

        kalaas.map((item) => (

          <div
            key={item.title}
            className="bg-black/70 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden hover:border-purple-500 transition duration-300"
          >

            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[500px] object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-semibold">
                {item.title}
              </h2>

              <Link
                href={`/${item.title.toLowerCase().replace(" ", "")}`}
                className="mt-4 inline-block px-4 py-2 rounded-full bg-purple-700 hover:bg-red-600 transition"
              >
                View Kalaa
              </Link>

            </div>

          </div>

        ))

      )
    );

  })()}

</div>

      {/* FOOTER */}
      <div className="py-20 text-zinc-500 text-sm">
        Son Of Parvati • Kalaa Archive
      </div>
    <div className="mt-20">

  <h1 className="text-4xl font-bold text-center mb-10 text-purple-500">
    Uploaded Kalaa
  </h1>

  <div className="grid md:grid-cols-3 gap-8">

    {posts.map((post) => (

      <div
        key={post.id}
        className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300"
      >

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-72 object-cover"
        />

        <div className="p-4">
          <div className="flex gap-4 mt-4">

            <a
              href={post.image}
              download
              className="bg-purple-600 px-4 py-2 rounded-xl"
           >
              Download
           </a>

        </div>

          <h2 className="text-2xl font-bold">
            {post.title}
          </h2>

          <p className="text-zinc-400 mt-2">
            {post.category}
          </p>
          <div className="flex gap-4 mt-4">

            <button
              onClick={async () => {

                const liked = localStorage.getItem(`liked-${post.id}`);

                if (liked) {
                  alert("Already liked this post!");
                  return;
                }

                await supabase
                  .from("posts")
                  .update({
                    likes: Number(post.likes || 0) + 1
               })
               .eq("id", post.id);

                localStorage.setItem(`liked-${post.id}`, "true");

                getPosts();

              }}
              className="bg-pink-700 hover:bg-pink-900 px-4 py-2 rounded-xl"
            >
              ❤️ {post.likes || 0}

            </button>

            <a
              href={post.image}
              download
              className="bg-purple-600 px-4 py-2 rounded-xl"
            >
              Download
            </a>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>

    </main>
  );
}