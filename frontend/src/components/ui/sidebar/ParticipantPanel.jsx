import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useMemo } from "react";
import { nameTructed } from "../../../utils/common";
import { FaHandPaper } from "react-icons/fa";
import { IoMicOffSharp, IoMicSharp } from "react-icons/io5";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { useVideoCfcContext } from "../../../context/VideoCfcContext";

function ParticipantListItem({ participantId, raisedHand }) {
  const { micOn, webcamOn, displayName, isLocal } =
    useParticipant(participantId);

  return (
    <div className="mt-2 m-2 p-2 bg-gray-700 rounded-lg mb-0">
      <div className="flex flex-1 items-center justify-center relative">
        <div
          style={{
            color: "#212032",
            backgroundColor: "#757575",
          }}
          className="h-10 w-10 text-lg mt-0 rounded overflow-hidden flex relative items-center justify-center"
        >
          {displayName?.charAt(0).toUpperCase()}
        </div>
        <div className="ml-2 mr-1 flex flex-1">
          <p className="text-base text-white overflow-hidden whitespace-pre-wrap overflow-ellipsis">
            {isLocal ? "You" : nameTructed(displayName, 15)}
          </p>
        </div>
        {raisedHand && (
          <div className="flex items-center justify-center m-1 p-1">
            <FaHandPaper />
          </div>
        )}
        <div className="m-1 p-1">
          {micOn ? <IoMicSharp /> : <IoMicOffSharp />}
        </div>
        <div className="m-1 p-1">
          {webcamOn ? <HiVideoCamera /> : <HiVideoCameraSlash />}
        </div>
      </div>
    </div>
  );
}

export function ParticipantPanel({ panelHeight }) {
  const { raisedHandsParticipants } = useVideoCfcContext();
  const mMeeting = useMeeting();
  const participants = mMeeting.participants;

  const sortedRaisedHandsParticipants = useMemo(() => {
    const participantIds = [...participants.keys()];

    const notRaised = participantIds.filter(
      (pID) =>
        raisedHandsParticipants.findIndex(
          ({ participantId: rPID }) => rPID === pID
        ) === -1
    );

    const raisedSorted = raisedHandsParticipants.sort((a, b) => {
      if (a.raisedHandOn > b.raisedHandOn) {
        return -1;
      }
      if (a.raisedHandOn < b.raisedHandOn) {
        return 1;
      }
      return 0;
    });

    const combined = [
      ...raisedSorted.map(({ participantId: p }) => ({
        raisedHand: true,
        participantId: p,
      })),
      ...notRaised.map((p) => ({ raisedHand: false, participantId: p })),
    ];

    return combined;
  }, [raisedHandsParticipants, participants]);

  const filterParticipants = (sortedRaisedHandsParticipants) =>
    sortedRaisedHandsParticipants;

  const part = useMemo(
    () => filterParticipants(sortedRaisedHandsParticipants, participants),

    [sortedRaisedHandsParticipants, participants]
  );

  return (
    <div
      className={`flex w-full flex-col bg-gray-750 overflow-y-auto `}
      style={{ height: panelHeight }}
    >
      <div
        className="flex flex-col flex-1"
        style={{ height: panelHeight - 100 }}
      >
        {[...participants.keys()].map((participantId, index) => {
          const { raisedHand, participantId: peerId } = part[index];
          return (
            <ParticipantListItem
              key={index}
              participantId={peerId}
              raisedHand={raisedHand}
            />
          );
        })}
      </div>
    </div>
  );
}
