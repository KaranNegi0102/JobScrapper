"use client";

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
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>

          {/* Logout Button */}
          {showLogout && onLogout && (
            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
