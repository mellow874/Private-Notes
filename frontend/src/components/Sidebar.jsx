import {
  ChevronFirst,
  ChevronLast,
  FileText,
  Plus,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import { supabase } from "../supabase";

// Sidebar component provides navigation and user actions
// It can expand/collapse and shows user profile actions at the bottom
export default function Sidebar({ onViewAllNotes, onAddNote }) {
  // Get the current user from context
  const { user } = useAuth();

  // useNavigate allows programmatic navigation (e.g., after logout)
  const navigate = useNavigate();

  // State to track if the sidebar is expanded or collapsed
  const [expanded, setExpanded] = useState(true);

  // State to track if the user profile dropdown is open
  const [profileOpen, setProfileOpen] = useState(false);

  // Function to handle user logout using Supabase v2
  const handleLogout = async () => {
    try {
      // Sign out the user from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Remove token from local storage and redirect to register page
      localStorage.removeItem("token");
      navigate("/register");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <aside
      className={`h-screen bg-[#F4F5FA] border-r flex flex-col transition-all duration-300 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* TOP SECTION: Expand/Collapse button */}
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => setExpanded((prev) => !prev)} // Toggle sidebar width
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          {expanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      {/* MAIN SECTION: Navigation buttons */}
      <div className="flex-1 px-2 space-y-2">
        {/* View all notes button */}
        <button
          onClick={onViewAllNotes}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-50 text-gray-700"
        >
          <FileText size={20} />
          {expanded && <span>View all notes</span>}
        </button>

        {/* Create note button */}
        <button
          onClick={onAddNote}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-50 text-gray-700"
        >
          <Plus size={20} />
          {expanded && <span>Create note</span>}
        </button>
      </div>

      {/* BOTTOM SECTION: User profile and logout */}
      <div className="p-3 relative">
        {/* Profile button toggles dropdown */}
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-50"
        >
          <UserCircle size={26} />
          {expanded && (
            <span className="text-sm font-medium">
              {user?.user_metadata?.name || "User"}
            </span>
          )}
        </button>

        {/* Dropdown menu with user info and logout */}
        {profileOpen && expanded && (
          <div className="absolute bottom-16 left-3 right-3 bg-white rounded-md shadow-md p-3 text-sm">
            {/* Display user's name */}
            <p className="font-medium">
              {user?.user_metadata?.name || "User"}
            </p>
            {/* Display user's email */}
            <p className="text-xs text-gray-500 mb-3">{user?.email}</p>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-500 hover:bg-gray-100 px-2 py-1 rounded"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
