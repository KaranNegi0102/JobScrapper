"use client";
import Link from "next/link";

interface NavbarProps {
  title: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

export default function Navbar({
  title,
  onLogout,
  showLogout = false,
}: NavbarProps) {
  return (
    <nav className="bg-blue-900 shadow-md border-b border-gray-200">
      <div className="max-w-7xl text-white mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex gap-4 items-center">
            <Link
              href="/?skipRedirect=true"
              className="text-white hover:text-blue-200 transition-colors duration-200 text-md font-sm "
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-white hover:text-blue-200 transition-colors duration-200 text-md font-sm "
            >
              Contact
            </Link>
            <Link
              href="/"
              className="text-white hover:text-blue-200 transition-colors duration-200 text-md font-sm "
            >
              About Us
            </Link>
          </div>

          {/* Title */}
          <div className="ml-[-15%] flex items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Logout Button */}
            {showLogout && onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
