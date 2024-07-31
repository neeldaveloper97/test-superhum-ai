import { FaRegCopy } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useState } from "react";
import toast from "react-hot-toast";

export const MeetingDetailsScreen = ({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  onClickStartMeeting,
}) => {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {iscreateMeetingClicked ? (
        <div className="border-solid border-gray-400 rounded-xl px-4 py-3  flex items-center justify-center">
          <div className="flex items-center gap-2">
            <p className="text-white text-base">Meeting code:</p>
            <span className="text-indigo-500">{meetingId}</span>
          </div>
          <button
            className="ml-2 bg-indigo-700 rounded-full shadow-md"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? <IoCheckmarkDoneSharp color="lime" /> : <FaRegCopy />}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder={"Enter meeting Id"}
            className="px-4 py-3 bg-gray-650 rounded-xl text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) : null}

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-xl text-white w-full text-center"
          />

          <p className="text-xs text-indigo-400 mt-1 text-center">
            Your name will help everyone identify you in the meeting.
          </p>
          <button
            disabled={participantName.length < 3}
            className={`w-full ${
              participantName.length < 3 ? "bg-gray-650 cursor-not-allowed" : "bg-indigo-700"
            }  text-white px-2 py-3 rounded-full mt-5 `}
            onClick={() => {
              if (iscreateMeetingClicked) {
                onClickStartMeeting();
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <div className="flex items-center justify-center flex-col w-full ">
            <button
              className="w-full bg-purple-350 text-white px-2 py-3 rounded-full bg-indigo-700"
              onClick={async () => {
                const { meetingId, err } = await _handleOnCreateMeeting();

                if (meetingId) {
                  setMeetingId(meetingId);
                  setIscreateMeetingClicked(true);
                } else {
                  toast.error(`${err}`);
                }
              }}
            >
              Create a meeting
            </button>
            <button
              className="w-full bg-gray-650 text-white px-2 py-3 rounded-full mt-5"
              onClick={() => {
                setIsJoinMeetingClicked(true);
              }}
            >
              Join a meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
