import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserCircle, LogOut } from "lucide-react";

import Signup from "./Signup";
import Login from "./Login";
import NoteCard from "./components/NoteCard";
import NotesModal from "./components/NotesModal";
import WelcomeText from "./components/WelcomeText";
import { useAuth } from "./context/ContextProvider";
import { supabase } from "./supabase";

// 🌐 Set your backend URL once here
const BACKEND_URL = "https://private-notes-dzpw.onrender.com";

function NotepadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const token = localStorage.getItem("token");

  // 🔄 Fetch notes from backend
  const fetchNotes = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${BACKEND_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(data.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    navigate("/register");
  };

  const openCreateModal = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  // ➕ Add note
  const addNote = async (title, description) => {
    try {
      await axios.post(
        `${BACKEND_URL}/notes`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add note:", error.message);
      alert("Cannot reach server. Make sure backend is running.");
    }
  };

  // ✏️ Edit note
  const editNote = async (id, title, description) => {
    try {
      await axios.put(
        `${BACKEND_URL}/notes/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to edit note:", error.message);
      alert("Cannot reach server.");
    }
  };

  // 🗑 Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error.message);
      alert("Cannot reach server.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-4 bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl rounded-md border px-4 py-2 text-sm"
        />

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 font-medium text-purple-700"
          >
            <UserCircle />
            {user?.user_metadata?.name || "User"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-md p-3 text-sm">
              <p className="font-medium">{user?.user_metadata?.name}</p>
              <p className="text-xs text-gray-500 mb-2">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:bg-gray-100 w-full px-2 py-1 rounded"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-8 py-10">
        {showWelcome ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <WelcomeText onFinish={() => setShowWelcome(false)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CREATE NOTE CARD */}
            <div
              onClick={openCreateModal}
              className="cursor-pointer bg-white rounded-xl border-2 border-dashed border-purple-300 flex items-center justify-center h-40 hover:border-purple-500 hover:shadow-md transition"
            >
              <span className="text-purple-600 font-medium">
                + Create new note
              </span>
            </div>

            {/* NOTES */}
            {notes
              .filter((note) =>
                note.title?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => {
                    setCurrentNote(note);
                    setIsModalOpen(true);
                  }}
                  deleteNote={deleteNote}
                />
              ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <NotesModal
          closeModal={() => setIsModalOpen(false)}
          addNote={addNote}
          editNote={editNote}
          currentNote={currentNote}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/notepad" element={<NotepadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
