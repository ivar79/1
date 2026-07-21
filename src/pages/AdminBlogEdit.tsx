import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight, Save, Image as ImageIcon } from "lucide-react";
import { adminFetch } from "../adminFetch";

export default function AdminBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await adminFetch(`/api/blog?admin=true`).then(r => r.json()); // We'll just fetch all and find it since there's no single fetch by ID admin route, or wait, we can fetch by slug. Actually we can just fetch all and find by ID.
      if (res.success) {
        const post = res.data.find((p: any) => p.id === id);
        if (post) {
          setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || "",
            coverImage: post.coverImage || "",
            isPublished: post.isPublished,
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).then(r => r.json());
      if (res.success) {
        navigate("/admin/blog");
      } else {
        alert(res.error || "خطا در ذخیره مقاله");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, ''); // basic slugify
    setFormData({ ...formData, slug });
  };

  if (loading) return <div className="p-8 text-center text-stone-400">در حال بارگذاری...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link to="/admin/blog" className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm font-medium">بازگشت به لیست مقالات</span>
        </Link>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8">
        <h1 className="text-xl font-black text-stone-100 mb-8 pb-4 border-b border-stone-800">
          {isNew ? "افزودن مقاله جدید" : "ویرایش مقاله"}
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400">عنوان مقاله</label>
              <input
                type="text"
                required
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={isNew ? generateSlug : undefined}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400">اسلاگ (URL)</label>
              <input
                type="text"
                required
                dir="ltr"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400">تصویر کاور (آدرس URL)</label>
            <div className="flex gap-2">
              <input
                type="url"
                dir="ltr"
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />
              {formData.coverImage && (
                <div className="w-12 h-12 rounded-lg bg-stone-800 overflow-hidden shrink-0 border border-stone-700">
                  <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400">چکیده (توضیح کوتاه)</label>
            <textarea
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors resize-y"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400">محتوای مقاله (پشتیبانی از HTML/متن ساده)</label>
            <textarea
              required
              rows={15}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors resize-y font-mono"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div className="border-t border-stone-800 pt-6 mt-6">
            <h3 className="text-sm font-bold text-stone-300 mb-4">تنظیمات سئو (SEO)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400">عنوان سئو (Meta Title)</label>
                <input
                  type="text"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400">توضیحات سئو (Meta Description)</label>
                <input
                  type="text"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-stone-800 pt-6 mt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPublished ? "bg-amber-500" : "bg-stone-700"}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.isPublished ? "left-1" : "left-7"}`} />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              <span className="text-sm font-medium text-stone-300">انتشار مقاله در سایت</span>
            </label>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "در حال ذخیره..." : "ذخیره مقاله"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
