"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../../../component/navbar";
import ScheduleModal from "../../../component/scheduleModal";
import { Users, Briefcase, CalendarPlus, ExternalLink,Funnel } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const BACKEND_URL = "http://localhost:8000";

  // Get unique sender names from emails for filter buttons
  const uniqueSenders = [...new Set(emails.map((email) => email.sender))];

  const senderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const email of emails) {
      counts[email.sender] = (counts[email.sender] ?? 0) + 1;
    }
    return counts;
  }, [emails]);

  // STEP 1: Check URL for ?code=... and exchange for token
  useEffect(() => {
    const url = new URL(window.location.href);
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

  const handleCardClick = (email: Email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleScheduleSuccess = (eventLink: string) => {
    alert(`Reminder Scheduled !! View it here : ${eventLink}`);
  };

  const filteredEmails = emails.filter((email) => {
    if (filterText === "" || filterText === "All") {
      return true;
    }
    return email.sender === filterText;
  });

  return (
    <div className="w-full h-full bg-blue-100">
      <Navbar
        title="JobMails"
        onLogout={handleLogout}
        showLogout={!!token}
      />

      <div className="p-6 mx-auto">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!token ? (
          <h1 className="bg-blue-600 text-white px-6 py-2 rounded">No Token</h1>
        ) : (
          <>
            <div className="flex gap-6 ">
              {/* Left Sidebar - Filter Buttons */}
              <div className="w-2/7 h-full shadow-xl rounded-xl bg-white p-6  flex-shrink-0">
                <h3 className="text-lg font-semibold gap-3 flex flex-row text-gray-700 mb-3">
                  <Funnel className="w-8 h-8 bg-gray-900 text-white rounded-full p-1"/>
                  Filter by sender
                </h3>
                <div className="space-y-2 ">
                  <button
                    onClick={() => setFilterText("")}
                    className={`w-full text-left rounded-lg flex flex-row hover:cursor-pointer gap-3 text-sm font-medium p-3 transition-colors transition-transform duration-100 transform hover:scale-95 ${
                      filterText === ""
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    <Users
                      className={`w-5 h-5 
                        ${filterText === "" ? "text-white" : "text-gray-700"}`}
                    />
                    All Senders ({emails.length})
                  </button>
                  {uniqueSenders.map((sender) => (
                    <button
                      key={sender}
                      onClick={() => setFilterText(sender)}
                      className={`w-full text-left  rounded-lg p-3 flex hover:cursor-pointer flex-row gap-3 text-sm font-medium transition-colors transition-transform duration-100 transform hover:scale-95 ${
                        filterText === sender
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <Briefcase
                        className={`w-5 h-5 ${
                          filterText === sender ? "text-white" : "text-gray-700"
                        }`}
                      />
                      {sender} ({senderCounts[sender] ?? 0})
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Emails */}
              <div className="flex-1">
                {loading ? (
                  <p className="text-black">Loading your job emails...</p>
                ) : filteredEmails.length === 0 ? (
                  <p>No emails match your filter criteria.</p>
                ) : (
                  <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredEmails.map((email) => (
                      <div
                        key={email.id}
                        className="group border bg-white shadow-full h-full border-l-4 border-red-400  relative rounded-xl p-8 shadow-sm overflow-hidden flex flex-col"
                      >
                        <h2 className="font-bold font-mono mb-6 text-gray-900 text-xl">
                          {email.sender}
                        </h2>

                        <div className="flex-1 flex flex-col">
                          <h2 className="font-mono text-gray-900 text-lg mb-7 ">
                            {email.subject}
                          </h2>
                          <p className="text-xs  font-mono text-gray-600 mb-7 flex-1">
                            {email.snippet}
                          </p>

                          <div className="mt-auto font-mono flex  flex-row gap-4 space-y-2">
                            <button
                              onClick={() => handleCardClick(email)}
                              className="w-full h-full p-4  flex flex-row font-bold text-center hover:cursor-pointer hover:text-white bg-[#c8e19d] text-gray-800 hover:bg-gray-900  transition-transform duration-100 transform hover:scale-95 rounded-xl"
                            >
                              <CalendarPlus className="w-1/2 h-1/2 mt-2" />
                              Add To Calendar
                            </button>

                            <button
                              onClick={() => {
                                const newWindow = window.open(
                                  email.link,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                                if (newWindow) newWindow.opener = null;
                              }}
                              className="w-full p-4 text-gray-800 font-bold flex flex-row text-center hover:cursor-pointer bg-[#f0dddd] hover:text-white hover:bg-blue-900 transition-transform duration-100 transform hover:scale-95 rounded-xl"
                            >
                              <ExternalLink className="w-1/2 h-1/2 mt-2" /> View
                              Email
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmail(null);
        }}
        email={selectedEmail}
        token={token}
        onScheduleSuccess={handleScheduleSuccess}
      />
    </div>
  );
}
