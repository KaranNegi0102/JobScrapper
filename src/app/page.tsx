"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../component/navbar";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gmail_access_token");
    const skipRedirect = new URLSearchParams(window.location.search).get(
      "skipRedirect"
    );
    if (token && !skipRedirect) {
      window.location.href = "/mainDashboard";
    }

    setIsAuthenticated(!!token);
  }, []);

  const BACKEND_URL = "http://localhost:8000";

  const handleLogin = () => {
    console.log("first step 1");
    const currentUrl = window.location.origin + "/mainDashboard";
    window.location.href = `${BACKEND_URL}/auth/login?redirect_uri=${encodeURIComponent(currentUrl)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar title="📧 JobMails" showLogout={false} />

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">JobMails</span>
          </h1>

          {isAuthenticated ? (
            <Link
              href="/mainDashboard"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started with Gmail →
            </button>
          )}
        </div>
      </div>
      <div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Baki ka landing page banega baad me
        </h1>
      </div>
    </div>
  );
}
