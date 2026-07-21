import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  
  

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    let timer: any;
    if (clicks > 0 && clicks < 5) {
      timer = setTimeout(() => setClicks(0), 2000);
    } else if (clicks >= 5) {
      setRevealed(true);
      setClicks(0);
    }
    return () => clearTimeout(timer);
  }, [clicks]);

  const handleSecretClick = () => {
    setClicks(c => c + 1);
  };

  const handleSuccess = (data: any, adminData: any) => {
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify({
      id: adminData?.id || 1,
      name: adminData?.name || "مدیر ارشد",
      username: adminData?.username || "admin",
      role: "admin"
    }));
    window.dispatchEvent(new Event("storage"));
    navigate("/admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Data required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        handleSuccess(data, data.admin);
      } else {
        setError(data.error || "Failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        handleSuccess(data, data.admin);
      } else {
        setError(data.error || "Google auth failed.");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xs w-full space-y-6">
        <div className="w-12 h-12 bg-black rounded-xl mx-auto flex items-center justify-center cursor-default">
           <span className="w-3 h-3 bg-white rounded-full"></span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono text-center" 
            placeholder="ID"
            dir="ltr"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono text-center tracking-widest" 
            placeholder="KEY"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 rounded-xl font-bold text-white bg-black hover:bg-stone-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ACCESS"}
          </button>
        </form>

        <div className="pt-2 flex justify-center opacity-80 hover:opacity-100 transition-opacity">
           <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login error")}
              theme="outline"
              size="medium"
              text="continue_with"
           />
        </div>

        {error && (
          <div className="text-center text-red-500 text-xs font-mono font-bold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
