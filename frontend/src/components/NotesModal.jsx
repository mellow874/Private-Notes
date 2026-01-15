import React, { useState, useEffect } from "react";

// NotesModal component allows the user to add a new note or edit an existing note
function NotesModal({ closeModal, addNote, currentNote, editNote }) {
  // State to store the note's title
  const [title, setTitle] = useState('');
  // State to store the note's description/content
  const [description, setDescription] = useState('');
  // handleSubmit runs when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload on form submit

    // If editing an existing note, call editNote function
    if (currentNote) {
      editNote(currentNote.id, title, description);
    } else {
      // Otherwise, call addNote to create a new note
      addNote(title, description);
    }
  };

  // useEffect runs when currentNote changes

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);          // pre-fill title
      setDescription(currentNote.content);  // pre-fill description
    } else {
      setTitle("");          // clear title for new note
      setDescription("");    // clear description for new note
    }
  }, [currentNote]);

  return (
    // Overlay: dark semi-transparent background covering the whole screen
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      
      {/* Modal container */}
      <div className="bg-white p-8 rounded">
        {/* Modal header */}
        <h2 className="text-xl font-bold mb-4">
          {currentNote ? "Edit Note" : "Add New Note"}
        </h2>

        {/* Form for note title and description */}
        <form onSubmit={handleSubmit}>
          {/* Input for note title */}
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="border p-2 w-full mb-4"
          />

          {/* Textarea for note description */}
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Note Description"
            className="border p-2 w-full mb-4"
          ></textarea>

          {/* Submit button */}
          <button
            type="submit"
            className="block w-full bg-black px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {currentNote ? "Update Note" : "Add Note"}
          </button>
        </form>

        {/* Cancel button to close the modal */}
        <button className="mt-4 text-red-500" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default NotesModal;
