import { useMeeting } from "@videosdk.live/react-sdk";
import { useVideoCfcContext } from "../../../context/VideoCfcContext";
import { FcGlobe } from "react-icons/fc";
import { ParticipantPanel } from "./ParticipantPanel";

export const SideBarTabView = ({
  height,
  sideBarContainerWidth,
  panelHeight,
  panelHeaderHeight,
  panelHeaderPadding,
  panelPadding,
  handleClose,
}) => {
  const { participants } = useMeeting();
  const { sideBarMode } = useVideoCfcContext();

  return (
    <div
      className="bg-gray-800 fixed top-0"
      style={{
        height,
        width: sideBarContainerWidth,
        paddingTop: panelPadding,
        paddingLeft: panelPadding,
        paddingRight: panelPadding,
        paddingBottom: panelPadding,
      }}
    >
      <div>
        <div
          className="bg-gray-750"
          style={{
            height: height,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <>
            {sideBarMode && (
              <div
                className={`flex items-center justify-between`}
                style={{
                  padding: panelHeaderPadding,
                  height: panelHeaderHeight - 1,
                  borderBottom: "1px solid #70707033",
                }}
              >
                <p className="text-base text-white font-bold">
                  {sideBarMode === "PARTICIPANTS"
                    ? `${
                        sideBarMode.charAt(0).toUpperCase() +
                          sideBarMode.slice(1).toLowerCase() || ""
                      } (${new Map(participants)?.size})`
                    : sideBarMode.charAt(0).toUpperCase() +
                        sideBarMode.slice(1).toLowerCase() || ""}
                </p>
                <button
                  className="text-white"
                  onClick={handleClose}
                  style={{ margin: 0, padding: 0 }}
                >
                  <FcGlobe className="h-5 w-5" />
                </button>
              </div>
            )}
            {sideBarMode === "PARTICIPANTS" ? (
              <ParticipantPanel panelHeight={panelHeight} />
            ) : null}
          </>
        </div>
      </div>
    </div>
  );
};
