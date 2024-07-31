import {
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
} from "@videosdk.live/react-sdk";
import toast from "react-hot-toast";

export const useMediaStream = () => {
  const getVideoTrack = async ({ webcamId, encoderConfig }) => {
    try {
      const track = await createCameraVideoTrack({
        cameraId: webcamId,
        encoderConfig: encoderConfig ? encoderConfig : "h540p_w960p",
        optimizationMode: "motion",
        multiStream: false,
      });
      if (!track) {
        toast.error("Please ensure your camera is connected and turned on.");
      }

      return track;
    } catch (error) {
      return null;
    }
  };

  const getAudioTrack = async ({ micId }) => {
    try {
      const track = await createMicrophoneAudioTrack({
        microphoneId: micId,
      });
      if (!track) {
        toast.error(
          "Please ensure your microphone is connected and turned on."
        );
      }
      return track;
    } catch (error) {
      return null;
    }
  };

  return { getVideoTrack, getAudioTrack };
};

export default useMediaStream;
