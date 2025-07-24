"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Email {
  id: string;
  subject: string;
  snippet: string;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = 'http://localhost:8000';

  // STEP 1: Check URL for ?code=... and exchange for token
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    const getTokenFromCode = async (code: string) => {
      try {
        const res = await axios.get(`${BACKEND_URL}/auth/callback?code=${code}`);
        const accessToken = res.data.access_token;
        console.log("accesstoken --> ", accessToken)
        localStorage.setItem('gmail_access_token', accessToken);
        setToken(accessToken);

        // Remove ?code= from the URL
        window.history.replaceState({}, document.title, '/');
      } catch (err) {
        setError('Failed to get access token from code');
        console.error(err);
      }
    };

    const storedToken = localStorage.getItem('gmail_access_token');
    console.log("storedToken is ->", storedToken)
    if (storedToken) {
      setToken(storedToken);
    } else if (code) {
      getTokenFromCode(code);
    }
  }, []);

  // STEP 2: Fetch job emails using the token
  useEffect(() => {
    const fetchEmails = async () => {
      if (!token) return;

      setLoading(true);
      try {
        console.log("access token is ", token)
        const res = await axios.get(`${BACKEND_URL}/emails?access_token=${token}`);
        setEmails(res.data);
      } catch (err) {
        setError('Failed to fetch job emails');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [token]);

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/login`;
  };

  const handleLogout = () => {
    localStorage.removeItem('gmail_access_token');
    setToken(null);
    setEmails([]);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📧 Gmail Job Email Scraper</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!token ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Login with Gmail
        </button>
      ) : (
        <>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded mb-6"
          >
            Logout
          </button>

          {loading ? (
            <p>Loading your job emails...</p>
          ) : emails.length === 0 ? (
            <p>No job-related emails found.</p>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="border rounded p-4 shadow-sm"
                >
                  <h2 className="font-semibold text-lg">{email.subject}</h2>
                  <p className="text-sm text-gray-600">{email.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
