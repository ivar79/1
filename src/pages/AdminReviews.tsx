import React, { useState, useEffect } from "react";
import { MessageSquare, Check, X, Trash2, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setReviews(data); else console.error("Data is not an array:", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id: number) => {
    if (!window.confirm("آیا از حذف این نظر اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reviews.filter(r => 
    r.customerName?.includes(search) || 
    r.comment?.includes(search) ||
    r.productTitle?.includes(search)
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-stone-800 mb-2">مدیریت نظرات</h1>
          <p className="text-stone-500 text-sm">بررسی و تایید نظرات مشتریان برای محصولات</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex gap-4 mb-6 relative">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو در نظرات، محصولات و فرستندگان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-500">در حال بارگذاری...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="pb-4 font-medium text-stone-500 text-sm">مشتری</th>
                  <th className="pb-4 font-medium text-stone-500 text-sm">محصول</th>
                  <th className="pb-4 font-medium text-stone-500 text-sm">امتیاز</th>
                  <th className="pb-4 font-medium text-stone-500 text-sm">نظر</th>
                  <th className="pb-4 font-medium text-stone-500 text-sm">وضعیت</th>
                  <th className="pb-4 font-medium text-stone-500 text-sm">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(review => (
                  <tr key={review.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-stone-800">
                      {review.customerName}
                      <div className="text-xs text-stone-400 mt-1">{new Date(review.createdAt).toLocaleDateString('fa-IR')}</div>
                    </td>
                    <td className="py-4 text-sm text-stone-600">
                      <Link to={`/product/${review.productId}`} className="hover:text-amber-600 underline" target="_blank">
                        {review.productTitle}
                      </Link>
                    </td>
                    <td className="py-4 text-sm">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-stone-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-stone-600 max-w-xs truncate" title={review.comment}>
                      {review.comment}
                    </td>
                    <td className="py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${review.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {review.isApproved ? 'تایید شده' : 'در انتظار'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleApproval(review.id, review.isApproved)}
                          className={`p-2 rounded-xl transition-all ${review.isApproved ? 'bg-amber-50 hover:bg-amber-100 text-amber-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'}`}
                          title={review.isApproved ? 'رد کردن' : 'تایید کردن'}
                        >
                          {review.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all"
                          title="حذف نظر"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-2xl text-stone-400 text-sm">
            هیچ نظری یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}
