"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AdminPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<any>(null);

  // EDIT STATES
  const [editingPost, setEditingPost] = useState<any>(null);

  const [editTitle, setEditTitle] = useState("");

  const [editCategory, setEditCategory] = useState("");

  const [editTags, setEditTags] = useState("");

  useEffect(() => {

    checkAdmin();

  }, []);

  async function checkAdmin() {

    const { data } = await supabase.auth.getUser();

    if (
      data.user?.email !==
      "thanos230yoo@gmail.com"
    ) {

      router.push("/");

      return;
    }

    await getPosts();

    setLoading(false);
  }

  async function getPosts() {

    const response = await supabase
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (response.error) {

      console.log(response.error);

      return;
    }

    setPosts(response.data || []);
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

    const imageUrl =
      data.publicUrl;

    const { error } =
      await supabase
        .from("posts")
        .insert([
          {
            title,
            image: imageUrl,
            category,
            tags,
          },
        ]);

    if (error) {

      console.log(error);

      alert(error.message);

      return;
    }

    alert("Kalaa Uploaded ");

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

  async function saveEdit() {

    if (!editingPost) return;

    const { error } =
      await supabase
        .from("posts")
        .update({
          title: editTitle,
          category: editCategory,
          tags: editTags,
        })
        .eq("id", editingPost.id);

    if (error) {

      console.log(error);

      alert("Update failed");

      return;
    }

    alert("Post updated!");

    setEditingPost(null);

    getPosts();
  }

  if (loading) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center text-5xl">

        Loading...

      </main>

    );
  }

  return (

    <main className="min-h-screen bg-black text-white p-10">

      {/* EDIT MODAL */}

      {editingPost && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-[#111] p-8 rounded-3xl w-[90%] max-w-xl border border-purple-800">

            <h2 className="text-3xl font-bold text-purple-500 mb-6">

              Edit Kalaa

            </h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(
                  e.target.value
                )
              }
              placeholder="Title"
              className="w-full mb-4 bg-black text-white px-4 py-3 rounded-xl outline-none"
            />

            <input
              type="text"
              value={editCategory}
              onChange={(e) =>
                setEditCategory(
                  e.target.value
                )
              }
              placeholder="Category"
              className="w-full mb-4 bg-black text-white px-4 py-3 rounded-xl outline-none"
            />

            <input
              type="text"
              value={editTags}
              onChange={(e) =>
                setEditTags(
                  e.target.value
                )
              }
              placeholder="Tags"
              className="w-full mb-6 bg-black text-white px-4 py-3 rounded-xl outline-none"
            />

            <div className="flex gap-4">

              <button
                onClick={saveEdit}
                className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-xl text-white font-bold"
              >

                Save

              </button>

              <button
                onClick={() =>
                  setEditingPost(null)
                }
                className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-xl text-white font-bold"
              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

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
              setTitle(
                e.target.value
              )
            }
            className="bg-black p-4 rounded-xl"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="bg-black p-4 rounded-xl"
          >

            <option value="">
              Choose Category
            </option>

            <option value="Kali maa">
              Kali maa
            </option>

            <option value="Durga maa">
              Durga maa
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
              setTags(
                e.target.value
              )
            }
            className="bg-black p-4 rounded-xl"
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(
                e.target.files?.[0] ||
                null
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

              <p className="text-zinc-500 mt-2">
  Artwork
</p>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() =>
                    deletePost(post.id)
                  }
                  className="bg-red-700 hover:bg-red-900 px-4 py-2 rounded-xl"
                >

                  Delete

                </button>

                <button
                  onClick={() => {

                    setEditingPost(post);

                    setEditTitle(
                      post.title
                    );

                    setEditCategory(
                      post.category
                    );

                    setEditTags(
                      post.tags || ""
                    );
                  }}
                  className="bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-xl"
                >

                  Edit

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>

  );
}
