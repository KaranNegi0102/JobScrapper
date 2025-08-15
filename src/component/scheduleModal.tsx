"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Email {
  id: string;
  subject: string;
  snippet: string;
  sender: string;
  link: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: Email | null;
  token: string | null;
  onScheduleSuccess: (eventLink: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  email,
  token,
  onScheduleSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = "http://localhost:8000";

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleSchedule = async () => {
    if (!email || !token || !selectedDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/schedule-reminder`,
        {},
        {
          params: {
            access_token: token,
            title: email.subject,
            setDate: selectedDate,
            description: email.snippet,
          },
        }
      );

      onScheduleSuccess(res.data.eventLink);
      onClose();
    } catch (err) {
      setError("Failed to schedule reminder. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !email) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm text-black flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Add To Calendar
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Email Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">From: {email.sender}</p>
          <p className="text-sm font-medium text-gray-800">{email.subject}</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={loading || !selectedDate}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
