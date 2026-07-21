import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Clock, Eye, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`).then(r => r.json());
      if (res.success) {
        setPost(res.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("لینک مقاله کپی شد!");
    }
  };

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen text-stone-900 font-sans flex flex-col" dir="rtl">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-stone-50 min-h-screen text-stone-900 font-sans flex flex-col" dir="rtl">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-24 space-y-6">
          <h1 className="text-2xl font-bold text-stone-900">مقاله پیدا نشد!</h1>
          <Link to="/blog" className="text-amber-600 font-bold hover:underline flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            بازگشت به بلاگ
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans" dir="rtl">
      <Helmet>
        <title>{post.metaTitle || `${post.title} | مجله خانه مبل`}</title>
        <meta name="description" content={post.metaDescription || post.excerpt || "مقاله‌ای از مجله خانه مبل"} />
      </Helmet>

      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-10 text-sm font-bold">
          <ArrowRight className="w-4 h-4" />
          بازگشت به مجله
        </Link>

        <article className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl shadow-stone-200/50 border border-stone-100">
          <header className="mb-10 space-y-6">
            <h1 className="text-3xl md:text-5xl font-black text-stone-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.viewCount} بازدید
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 mr-auto bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl transition-colors text-stone-700"
              >
                <Share2 className="w-4 h-4" />
                اشتراک‌گذاری
              </button>
            </div>
          </header>

          {post.coverImage && (
            <figure className="mb-12 rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 aspect-video">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </figure>
          )}

          {post.excerpt && (
            <div className="text-lg md:text-xl font-medium text-stone-600 leading-relaxed mb-10 border-r-4 border-amber-500 pr-6">
              {post.excerpt}
            </div>
          )}

          <div 
            className="prose prose-stone prose-lg md:prose-xl max-w-none text-stone-700 font-sans leading-loose
              prose-headings:font-black prose-headings:text-stone-900 
              prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl
              prose-p:text-justify"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
