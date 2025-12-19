import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Axios for HTTP requests
import axios from "axios";
// Pages
import Signup from "./Signup";
import Login from "./Login";
// Components
import Sidebar from "./components/Sidebar";
import NoteCard from "./components/NoteCard";
import NotesModal from "./components/NotesModal";
import WelcomeText from "./components/WelcomeText";

function App() {
  // Modal visibility state
  const [isModalOpen, setModalOpen] = useState(false);
  // Notes data state
  const [notes, setNotes] = useState([]);
  // Currently selected note (for editing)
  const [currentNote, setCurrentNote] = useState(null);
  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle between welcome screen and notes view
  const [showNotes, setShowNotes] = useState(false);

  // Backend API URL from environment variables
  console.log("API_URL:", import.meta.env.VITE_BACKEND_URL);

  // Auth token stored after login
  const token = localStorage.getItem("token");

  /**
   * Close the add/edit note modal
   * and reset the current note state
   */
  const closeModal = () => {
    setModalOpen(false);
    setCurrentNote(null);
  };

  /**
   * Fetch all notes for the logged-in user
   */
  const fetchNotes = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${API_URL}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(data.notes);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  /**
   * Fetch notes when a token becomes available
   * (e.g. after login)
   */
  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  /**
   * Open modal for creating a new note
   */
  const handleCreateNote = () => {
    setCurrentNote(null);
    setShowNotes(true);
    setModalOpen(true);
  };

  /**
   * Open modal for editing an existing note
   */
  const handleEditNote = (note) => {
    setCurrentNote(note);
    setShowNotes(true);
    setModalOpen(true);
  };

  /**
   * Create a new note
   */
  const addNote = async (title, description) => {
    try {
      await axios.post(
        `${API_URL}/notes`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotes();
      closeModal();
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  /**
   * Update an existing note
   */
  const editNote = async (id, title, description) => {
    try {
      await axios.put(
        `${API_URL}/notes/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotes();
      closeModal();
    } catch (err) {
      console.error("Failed to edit note:", err);
    }
  };

  /**
   * Delete a note by ID
   */
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    // App-level routing
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Notepad Route */}
        <Route
          path="/notepad"
          element={
            token ? (
              <div className="flex h-screen">
                {/* Sidebar navigation */}
                <Sidebar
                  onViewAllNotes={() => setShowNotes(true)}
                  onAddNote={handleCreateNote}
                />

                {/* Main content area */}
                <div className="bg-purple-900 w-full relative">
                  {/* Welcome screen */}
                  {!showNotes && <WelcomeText />}

                  {/* Notes list */}
                  {showNotes && (
                    <>
                      {/* Search input */}
                      <div className="px-8 pt-4">
                        <input
                          type="text"
                          placeholder="Search notes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full mb-6 p-3 text-white rounded border bg-transparent"
                        />
                      </div>

                      {/* Notes grid */}
                      <div className="px-8 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {notes
                          .filter((note) =>
                            note.title
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((note) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              onEdit={handleEditNote}
                              deleteNote={deleteNote}
                            />
                          ))}
                      </div>
                    </>
                  )}

                  {/* Floating add note button */}
                  <button
                    onClick={handleCreateNote}
                    className="fixed right-4 bottom-4 bg-white text-black text-2xl p-4 rounded shadow"
                  >
                    +
                  </button>

                  {/* Add/Edit Note Modal */}
                  {isModalOpen && (
                    <NotesModal
                      closeModal={closeModal}
                      addNote={addNote}
                      editNote={editNote}
                      currentNote={currentNote}
                    />
                  )}
                </div>
              </div>
            ) : (
              // Redirect unauthenticated users
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
