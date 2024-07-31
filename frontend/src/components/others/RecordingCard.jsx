import { useState } from "react";
import { Loader } from "../ui/loader/Loader";
import { downloadRecInMp3 } from "../../api";

export const RecordingCard = ({ handleDownloadMp4, recording }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center justify-between mt-3 p-3 rounded-xl shadow-md cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-[10px] h-[10px] rounded-full bg-indigo-700"></div>
        <p className="ml-2">{recording.room_id}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => handleDownloadMp4(recording.recording_links[0])}
          className="rounded-full bg-indigo-700 w-[180px]"
        >
          Download MP4
        </button>
        <button
          disabled={loading}
          onClick={() => {
            downloadRecInMp3(recording.recording_links[0], setLoading);
          }}
          className="rounded-full bg-indigo-700 w-[180px] flex items-center justify-center"
        >
          {loading ? <Loader /> : "Download MP3"}
        </button>
      </div>
    </div>
  );
};
