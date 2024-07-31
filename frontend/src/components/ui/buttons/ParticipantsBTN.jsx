import { useMeeting } from "@videosdk.live/react-sdk";
import { IoPeople } from "react-icons/io5";
import { useVideoCfcContext } from "../../../context/VideoCfcContext";
import { MobileIconButton } from "./MobileIconButton";
import { OutlinedButton } from "./OutlinedButton";
import { sideBarModes } from "../../../utils/common";

export const ParticipantsBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode } = useVideoCfcContext();
  const { participants } = useMeeting();
  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Participants"}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      buttonText={"Participants"}
      disabledOpacity={1}
      Icon={IoPeople}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
        );
      }}
      badge={`${new Map(participants)?.size}`}
    />
  ) : (
    <OutlinedButton
      Icon={IoPeople}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
        );
      }}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      tooltip={"View \nParticipants"}
      badge={`${new Map(participants)?.size}`}
    />
  );
};
