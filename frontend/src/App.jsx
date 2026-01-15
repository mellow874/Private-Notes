import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Signup from "./Signup";
import Login from "./Login";

import WelcomeText from "./components/WelcomeText";
import NoteCard from "./components/NoteCard";
import NotesModal from "./components/NotesModal";

import { useAuth } from "./context/ContextProvider";
import { supabase } from "./supabase";

function App() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showNotes, setShowNotes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3002/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Filter notes by search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      {/* TOP BAR */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white">
        {/* Search */}
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 font-medium text-sm"
          >
            {user?.user_metadata?.name || "User"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md p-3 text-sm">
              <p className="font-semibold">
                {user?.user_metadata?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 mb-3">{user?.email}</p>

              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-1 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6">
        {!showNotes ? (
          <WelcomeText onFinish={() => setShowNotes(true)} />
        ) : (
          <>
            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Create Note Card */}
              <button
                onClick={() => {
                  setEditingNote(null);
                  setIsModalOpen(true);
                }}
                className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-50"
              >
                + Create Note
              </button>

              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => {
                    setEditingNote(n);
                    setIsModalOpen(true);
                  }}
                  deleteNote={async (id) => {
                    await axios.delete(
                      `http://localhost:3002/notes/${id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    fetchNotes();
                  }}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <NotesModal
          editingNote={editingNote}
          closeModal={() => setIsModalOpen(false)}
          refreshNotes={fetchNotes}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
