import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import { OutlinedButton } from "../buttons/OutlinedButton";
import { FaRecordVinyl } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import recordingBlink from "../../static/animations/recording-blink.json";
import useIsRecording from "../../../hooks/useIsRecording";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useIsTab } from "../../../hooks/useIsTab";
import { MeetingIdCopyBTN } from "../buttons/MeetingIdCopyBTN";
import { MicBTN } from "../buttons/MicBTN";
import { WebCamBTN } from "../buttons/WebCamBTN";
import { ParticipantsBTN } from "../buttons/ParticipantsBTN";
import { LeaveBTN } from "../buttons/LeaveBTN";
import { fetchAndStoreMeetingRec, startRecordingA } from "../../../api";

export const BottomBar = ({ bottomBarHeight, user }) => {
  const RecordingBTN = () => {
    const { stopRecording, recordingState, meetingId } = useMeeting();
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: recordingBlink,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
      height: 64,
      width: 160,
    };

    const isRecording = useIsRecording();
    const isRecordingRef = useRef(isRecording);

    useEffect(() => {
      isRecordingRef.current = isRecording;
    }, [isRecording]);

    const { isRequestProcessing } = useMemo(
      () => ({
        isRequestProcessing:
          recordingState === Constants.recordingEvents.RECORDING_STARTING ||
          recordingState === Constants.recordingEvents.RECORDING_STOPPING,
      }),
      [recordingState]
    );

    const _handleClick = () => {
      const isRecording = isRecordingRef.current;

      if (isRecording) {
        stopRecording();
        setTimeout(() => {
          fetchAndStoreMeetingRec(meetingId, user.id);
        }, 100);
      } else {
        startRecordingA(meetingId);
      }
    };

    return (
      <OutlinedButton
        Icon={FaRecordVinyl}
        onClick={_handleClick}
        isFocused={isRecording}
        tooltip={
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "Stop Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STARTING
            ? "Starting Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPED
            ? "Start Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STOPPING
            ? "Stopping Recording"
            : "Start Recording"
        }
        lottieOption={isRecording ? defaultOptions : null}
        isRequestProcessing={isRequestProcessing}
      />
    );
  };

  const tollTipEl = useRef();
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const [open, setOpen] = useState(false);

  const handleClickFAB = () => {
    setOpen(true);
  };

  const handleCloseFAB = () => {
    setOpen(false);
  };

  const BottomBarButtonTypes = useMemo(
    () => ({
      END_CALL: "END_CALL",
      PARTICIPANTS: "PARTICIPANTS",
      WEBCAM: "WEBCAM",
      MIC: "MIC",
      RECORDING: "RECORDING",
      MEETING_ID_COPY: "MEETING_ID_COPY",
    }),
    []
  );

  const otherFeatures = [
    { icon: BottomBarButtonTypes.PARTICIPANTS },
    { icon: BottomBarButtonTypes.MEETING_ID_COPY },
  ];

  return isMobile || isTab ? (
    <div
      className="flex items-center justify-center"
      style={{ height: bottomBarHeight }}
    >
      <LeaveBTN />
      <MicBTN />
      <WebCamBTN />
      <RecordingBTN />
      <OutlinedButton Icon={BsThreeDots} onClick={handleClickFAB} />
      <Transition appear show={Boolean(open)} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 9999 }}
          onClose={handleCloseFAB}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100 scale-100"
            leaveTo="translate-y-full opacity-0 scale-95"
          >
            <div className="fixed inset-0 overflow-y-hidden">
              <div className="flex h-full items-end justify-end text-center">
                <Dialog.Panel className="w-screen transform overflow-hidden bg-gray-800 shadow-xl transition-all">
                  <div className="grid container bg-gray-800 py-6">
                    <div className="grid grid-cols-12 gap-2">
                      {otherFeatures.map(({ icon }, index) => {
                        return (
                          <div
                            key={index}
                            className={`grid items-center justify-center ${
                              icon === BottomBarButtonTypes.MEETING_ID_COPY
                                ? "col-span-7 sm:col-span-5 md:col-span-3"
                                : "col-span-4 sm:col-span-3 md:col-span-2"
                            }`}
                          >
                            {icon === BottomBarButtonTypes.PARTICIPANTS ? (
                              <ParticipantsBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : icon ===
                              BottomBarButtonTypes.MEETING_ID_COPY ? (
                              <MeetingIdCopyBTN
                                isMobile={isMobile}
                                isTab={isTab}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  ) : (
    <div className="w-full flex items-center justify-center">
      <div className="md:flex w-full max-w-[1280px] lg:px-2 xl:px-6 pb-2 px-2 fixed bottom-0 hidden">
        <MeetingIdCopyBTN />
        <div
          className="flex flex-1 items-center justify-center"
          ref={tollTipEl}
        >
          <RecordingBTN />
          <MicBTN />
          <WebCamBTN />
          <LeaveBTN />
        </div>
        <div className="flex items-center justify-center">
          <ParticipantsBTN isMobile={isMobile} isTab={isTab} />
        </div>
      </div>
    </div>
  );
};
