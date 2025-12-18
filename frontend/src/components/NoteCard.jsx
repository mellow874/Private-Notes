import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// NoteCard component displays a single note with title, content preview, and action buttons
function NoteCard({ note, onEdit, deleteNote }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between h-full">
      {/* Container for the note card */}

      {/* Title and Content Section */}
      <div>
        {/* Category label above the note title */}
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          Category
        </label>

        {/* Note title displayed inside a styled box */}
        <div className="w-full rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">
          {note.title}
        </div>

        {/* Content preview */}
        <p
          className="mt-3 text-sm text-gray-700 line-clamp-2 overflow-hidden">
          {/* Content gets limited to 2 lines and the rest is hidden*/}
          {note.content}
        </p>
      </div>

      {/* Actions Section (Edit and Delete buttons) */}
      <div className="mt-4 flex justify-between items-center">
        {/* Edit button */}
        <button
          onClick={() => onEdit(note)} // Calls parent function to edit this note
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"
        >
          <FaEdit size={14} /> {/* Edit icon */}
          Edit
        </button>

        {/* Delete button */}
        <button
          onClick={() => deleteNote(note.id)} // Calls parent function to delete this note by id
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
        >
          <FaTrash size={14} /> {/* Trash icon */}
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
