import { useState, useEffect } from "react";
import { fetchRecordingsSupabase } from "../api";
import { RecordingCard } from "../components/others/RecordingCard";

export const Recordings = ({ user }) => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    if (user) {
      fetchRecordings(user.id);
    }
  }, [user]);

  const fetchRecordings = async (user_id) => {
    try {
      const { data } = await fetchRecordingsSupabase(user_id);
      setRecordings(data ? data : []);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    }
  };

  const handleDownloadMp4 = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="w-screen h-screen flex-col items-center justify-center mt-10 py-5 px-5">
      {!recordings && <p>Loading...</p>}
      <h1 className="my-8">Your Recordings</h1>
      {recordings &&
        recordings.map((recording) => (
          <RecordingCard
            key={recording.id}
            handleDownloadMp4={handleDownloadMp4}
            recording={recording}
          />
        ))}
    </div>
  );
};
