import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import { adminFetch } from "../adminFetch";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await adminFetch("/api/blog?admin=true").then(r => r.json());
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;
    try {
      const res = await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" }).then(r => r.json());
      if (res.success) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900 p-6 rounded-2xl border border-stone-800">
        <div>
          <h1 className="text-xl font-black text-stone-100 font-sans tracking-tight">مدیریت مقالات (بلاگ)</h1>
          <p className="text-stone-400 text-xs mt-1">تولید محتوا و سئو سایت</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          مقاله جدید
        </Link>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-stone-800/50 text-stone-300 border-b border-stone-800 text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">عنوان مقاله</th>
                <th className="px-6 py-4">اسلاگ (آدرس)</th>
                <th className="px-6 py-4">وضعیت</th>
                <th className="px-6 py-4">بازدید</th>
                <th className="px-6 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500">در حال بارگذاری...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500">هیچ مقاله‌ای یافت نشد.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-100">{post.title}</td>
                    <td className="px-6 py-4 font-mono text-xs text-stone-400">{post.slug}</td>
                    <td className="px-6 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                          منتشر شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-stone-800 text-stone-400 border border-stone-700">
                          پیش‌نویس
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <Eye className="w-3.5 h-3.5" />
                        {post.viewCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
                          title="مشاهده در سایت"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
