import { useMeeting } from "@videosdk.live/react-sdk";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export const MeetingIdCopyBTN = () => {
  const { meetingId } = useMeeting();
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="flex items-center justify-center lg:ml-0 ml-4 mt-4 xl:mt-0">
      <div className="flex items-center justify-center gap-3">
        <h3 className="text-white">{meetingId}</h3>
        <button
          className="rounded-full bg-indigo-700"
          onClick={() => {
            navigator.clipboard.writeText(meetingId);
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          }}
        >
          {isCopied ? <IoCheckmarkDoneSharp /> : <FaRegCopy />}
        </button>
      </div>
    </div>
  );
};
