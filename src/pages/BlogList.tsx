import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog").then(r => r.json());
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans" dir="rtl">
      <Helmet>
        <title>مجله دکوراسیون و مبل | خانه مبل</title>
        <meta name="description" content="مقالات آموزشی، راهنمای خرید مبل و جدیدترین اخبار دکوراسیون داخلی در مجله خانه مبل." />
      </Helmet>

      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-[70vh]">
        <div className="mb-16 text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900">
            مجله <span className="text-amber-600">خانه مبل</span>
          </h1>
          <p className="text-stone-500 leading-relaxed text-sm md:text-base">
            راهنمای خرید، نکات دکوراسیون داخلی و جدیدترین ترندهای طراحی مبلمان را در اینجا بخوانید.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="w-full aspect-[4/3] bg-stone-200 rounded-3xl" />
                <div className="h-6 bg-stone-200 rounded-lg w-3/4" />
                <div className="h-4 bg-stone-200 rounded-lg w-full" />
                <div className="h-4 bg-stone-200 rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            هنوز مقاله‌ای منتشر نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-stone-200/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-stone-100">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      بدون تصویر
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-stone-800 shadow-sm">
                    مقاله
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] md:text-xs text-stone-400 font-medium mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount} بازدید
                    </div>
                  </div>

                  <h2 className="text-lg md:text-xl font-bold text-stone-900 leading-tight mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-amber-600 font-bold text-xs">
                    <span>ادامه مطلب</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
