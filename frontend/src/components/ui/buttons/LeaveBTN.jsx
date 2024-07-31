import { useMeeting } from "@videosdk.live/react-sdk";
import { IoMdExit } from "react-icons/io";
import { useVideoCfcContext } from "../../../context/VideoCfcContext";
import { OutlinedButton } from "./OutlinedButton";

export const LeaveBTN = () => {
  const { leave } = useMeeting();
  const { setIsMeetingLeft } = useVideoCfcContext();

  return (
    <OutlinedButton
      Icon={IoMdExit}
      bgColor="bg-red-150"
      onClick={() => {
        leave();
        setIsMeetingLeft(true);
      }}
      tooltip="Leave Meeting"
    />
  );
};
