"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../component/navbar";

interface Email {
  id: string;
  subject: string;
  snippet: string;
  sender: string;
  link: string;
}

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  const BACKEND_URL = "http://localhost:8000";

  // Get unique sender names from emails for filter buttons
  const uniqueSenders = [...new Set(emails.map((email) => email.sender))];

  // STEP 1: Check URL for ?code=... and exchange for token
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const tokenFromQuery = url.searchParams.get("token"); // ✅ add this

    const storedToken = localStorage.getItem("gmail_access_token");
    if (storedToken) {
      setToken(storedToken);
    } else if (tokenFromQuery) {
      localStorage.setItem("gmail_access_token", tokenFromQuery);
      setToken(tokenFromQuery);
      window.history.replaceState({}, document.title, "/mainDashboard"); // remove ?token=
    }
    //  else if (code) {
    //   getTokenFromCode(code); // only if you're still doing code exchange on frontend
    // }
  }, []);

  // STEP 2: Fetch job emails using the token
  useEffect(() => {
    const fetchEmails = async () => {
      if (!token) return;

      setLoading(true);
      try {
        // console.log("access token is ", token)
        const res = await axios.get(
          `${BACKEND_URL}/emails?access_token=${token}`
        );
        console.log(res);
        setEmails(res.data);
      } catch (err) {
        setError("Failed to fetch job emails");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [token]);

  // const handleLogin = () => {
  //   console.log("finest step 1");
  //   // Redirect to login with the current dashboard URL as the redirect target
  //   const currentUrl = window.location.origin + "/mainDashboard";
  //   window.location.href = `${BACKEND_URL}/auth/login?redirect_uri=${encodeURIComponent(
  //     currentUrl
  //   )}`;
  // };

  const handleLogout = () => {
    localStorage.removeItem("gmail_access_token");
    setToken(null);
    setEmails([]);
    setFilterText("");
    // logout krte hi landing page par
    window.location.href = "/";
  };

  // Filter emails based on sender
  const filteredEmails = emails.filter((email) => {
    if (filterText === "" || filterText === "All") {
      return true;
    }
    return email.sender === filterText;
  });

  return (
    <div className="w-full h-full bg-white">
      <Navbar
        title="📧 JobMails"
        onLogout={handleLogout}
        showLogout={!!token}
      />

      <div className="p-6 mx-auto">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!token ? (
          <h1
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            No Token
          </h1>
        ) : (
          <>
            <div className="flex gap-6">
              {/* Left Sidebar - Filter Buttons */}
              <div className="w-64 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Filter by sender:
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilterText("")}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterText === ""
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {uniqueSenders.map((sender) => (
                    <button
                      key={sender}
                      onClick={() => setFilterText(sender)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterText === sender
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {sender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Emails */}
              <div className="flex-1">
                {loading ? (
                  <p>Loading your job emails...</p>
                ) : filteredEmails.length === 0 ? (
                  <p>No emails match your filter criteria.</p>
                ) : (
                  <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className="group border h-[255px] bg-blue-800 relative rounded-md p-4 shadow-sm overflow-hidden"
                      >
                        <h2 className="font-bold underline mb-5 text-center text-white text-lg">
                          {email.sender}
                        </h2>
                        <div className="  ">
                          <h2 className="font-semibold  text-gray-300 text-lg">
                            {email.subject}
                          </h2>
                          <p className="text-sm text-gray-200 mb-4 ">
                            {email.snippet}
                          </p>
                        </div>
                        <a
                          href={email.link}
                          className="mt-2 p-1 text-gray-800 font-bold absolute bottom-[-40px] left-0 w-full  text-center bg-blue-200 transition-all duration-500 ease-out group-hover:bottom-0"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Email 🔍
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
