import { FaRecordVinyl } from "react-icons/fa";
import { OutlinedButton } from "./OutlinedButton";
import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import recordingBlink from "../../static/animations/recording-blink.json";
import useIsRecording from "../../../hooks/useIsRecording";
import { useEffect, useMemo, useRef } from "react";

export const RecordingBTN = () => {
  const { startRecording, stopRecording, recordingState } = useMeeting();
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
    } else {
      startRecording();
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
