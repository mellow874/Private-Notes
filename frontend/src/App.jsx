import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Signup from "./Signup";
import Login from "./Login";
import Sidebar from "./components/Sidebar";
import NoteCard from "./components/NoteCard";
import NotesModal from "./components/NotesModal";
import WelcomeText from "./components/WelcomeText";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const token = localStorage.getItem("token");

  const closeModal = () => {
    setModalOpen(false);
    setCurrentNote(null);
  };

  const fetchNotes = async () => {
    if (!token) return;

    const { data } = await axios.get("http://localhost:3002/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(data.notes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = () => {
    setCurrentNote(null);
    setShowNotes(true);
    setModalOpen(true);
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setShowNotes(true);
    setModalOpen(true);
  };

  const addNote = async (title, description) => {
    await axios.post(
      "http://localhost:3002/notes",
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchNotes();
    closeModal();
  };

  const editNote = async (id, title, description) => {
    await axios.put(
      `http://localhost:3002/notes/${id}`,
      { title, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchNotes();
    closeModal();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:3002/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/notepad"
          element={
            <div className="flex h-screen">
              <Sidebar
                onViewAllNotes={() => setShowNotes(true)}
                onAddNote={handleCreateNote}
              />

              <div className="bg-black w-full relative">
                {!showNotes && <WelcomeText />}

                {showNotes && (
                  <>
                    <div className="px-8 pt-4">
                      <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-6 p-3 text-white rounded border"
                      />
                    </div>

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

                <button
                  onClick={handleCreateNote}
                  className="fixed right-4 bottom-4 bg-white text-black text-2xl p-4 rounded shadow"
                >
                  +
                </button>

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
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
