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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar title="📧 JobMails" showLogout={false} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              ✨ Smart Email Management for Job Seekers
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Transform your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                Job Search
              </span>
              <br />
              <span className="text-4xl md:text-5xl text-gray-700 font-semibold">
                with Smart Email Management
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your job applications, track responses, and never miss an opportunity with our intelligent email organization system.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            {isAuthenticated ? (
              <Link
                href="/mainDashboard"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Go to Dashboard
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Get Started with Gmail
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Preview Section */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Organization</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically categorize and organize your job-related emails with intelligent filtering and tagging.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Responses</h3>
              <p className="text-gray-600 leading-relaxed">
                Never miss a deadline with instant notifications and automated response suggestions for your applications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
                📈
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your application status, response rates, and optimize your job search strategy with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 JobMails. Streamlining your job search journey.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}