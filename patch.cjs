const fs = require('fs');
const content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

const target = `  useEffect(() => {
    if (product) {
      fetch(\`/api/products/\${product.id}/reviews\`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setReviews(data);
        })
        .catch(err => console.error(err));
    }
  }, [product]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmittingReview(true);
    setReviewMessage({ type: "", text: "" });

    try {
      const res = await fetch(\`/api/products/\${product.id}/reviews\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: reviewName, rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (data.success) {
        setReviewMessage({ type: "success", text: data.message });
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
      } else {
        setReviewMessage({ type: "error", text: data.error || "خطا در ثبت نظر" });
      }
    } catch (err) {
      setReviewMessage({ type: "error", text: "خطای ارتباط با سرور" });
    } finally {
      setIsSubmittingReview(false);
    }
  };`;

const replacement = `  useEffect(() => {
    if (data?.product) {
      fetch(\`/api/products/\${data.product.id}/reviews\`)
        .then(r => r.json())
        .then(resData => {
          if (Array.isArray(resData)) setReviews(resData);
        })
        .catch(err => console.error(err));
    }
  }, [data?.product]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.product) return;

    setIsSubmittingReview(true);
    setReviewMessage({ type: "", text: "" });

    try {
      const res = await fetch(\`/api/products/\${data.product.id}/reviews\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: reviewName, rating: reviewRating, comment: reviewComment })
      });
      const resData = await res.json();
      if (resData.success) {
        setReviewMessage({ type: "success", text: resData.message });
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
      } else {
        setReviewMessage({ type: "error", text: resData.error || "خطا در ثبت نظر" });
      }
    } catch (err) {
      setReviewMessage({ type: "error", text: "خطای ارتباط با سرور" });
    } finally {
      setIsSubmittingReview(false);
    }
  };`;

if (content.includes("if (product) {")) {
  fs.writeFileSync('src/pages/ProductDetail.tsx', content.replace(target, replacement));
  console.log("Patched successfully!");
} else {
  console.log("Target not found!");
}
