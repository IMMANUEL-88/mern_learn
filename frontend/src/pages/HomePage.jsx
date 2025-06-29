import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";

const HomePage = () => {
  const [isRateLimited, SetIsRateLimited] = useState(false);
  const [notes, SetNotes] = useState([]);
  const [loading, SetLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        SetNotes(res.data);
        SetIsRateLimited(false);
      } catch (error) {
        console.log("Error Fetching Notes");
        console.log(error);
        if (error.response?.status === 429) {
          SetIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        SetLoading(false);
      }
    };

    fetchNotes();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {notes.length === 0 && !isRateLimited && <NotesNotFound/>}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={SetNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
