import { useEffect, useRef, useState } from "react";
import { Constants, useMediaDevice } from "@videosdk.live/react-sdk";
import { useVideoCfcContext } from "../../../context/VideoCfcContext";
import useMediaStream from "../../../hooks/useMediaStream";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { IoMicOffSharp, IoMicSharp } from "react-icons/io5";
import { MicPermissionDenied } from "../../ui/icons/MicOffPermissionDenied";
import { CameraPermissionDenied } from "../../ui/icons/CameraPermissionDenied";
import { HiVideoCamera, HiVideoCameraSlash } from "react-icons/hi2";
import { createMeeting, getToken, validateMeeting } from "../../../api";
import toast from "react-hot-toast";
import DropDownCam from "../../others/DropDownCam";
import { DropDownSpeaker } from "../../others/DropDownSpeaker";
import { DropDown } from "../../others/DropDown";
import { MeetingDetailsScreen } from "../../others/MeetingDetailsScreen";
import ConfirmBox from "../../others/ConfirmBox";
import { ButtonWithTooltip } from "../../ui/buttons/ButtonWithTooltip";
import {
  _toggleMic,
  _toggleWebcam,
  getAudioDevices,
  getCameraDevices,
} from "./functions/functions";

export const JoiningScreen = ({
  participantName,
  setParticipantName,
  setMeetingId,
  setToken,
  onClickStartMeeting,
  micOn,
  webcamOn,
  setWebcamOn,
  setMicOn,
  customAudioStream,
  setCustomAudioStream,
  setCustomVideoStream,
}) => {
  const {
    selectedWebcam,
    selectedMic,
    setSelectedMic,
    setSelectedWebcam,
    setSelectedSpeaker,
    isCameraPermissionAllowed,
    isMicrophonePermissionAllowed,
    setIsCameraPermissionAllowed,
    setIsMicrophonePermissionAllowed,
  } = useVideoCfcContext();

  const [{ webcams, mics, speakers }, setDevices] = useState({
    webcams: [],
    mics: [],
    speakers: [],
  });
  const { getVideoTrack, getAudioTrack } = useMediaStream();
  const {
    checkPermissions,
    getCameras,
    getMicrophones,
    requestPermission,
    getPlaybackDevices,
  } = useMediaDevice({ onDeviceChanged });
  const [audioTrack, setAudioTrack] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [dlgMuted, setDlgMuted] = useState(false);
  const [dlgDevices, setDlgDevices] = useState(false);
  const [didDeviceChange, setDidDeviceChange] = useState(false);

  const videoPlayerRef = useRef();
  const videoTrackRef = useRef();
  const audioTrackRef = useRef();
  const audioAnalyserIntervalRef = useRef();
  const permissonAvaialble = useRef();
  const webcamRef = useRef();
  const micRef = useRef();
  const isMobile = useIsMobile();

  useEffect(() => {
    webcamRef.current = webcamOn;
  }, [webcamOn]);

  useEffect(() => {
    micRef.current = micOn;
  }, [micOn]);

  useEffect(() => {
    permissonAvaialble.current = {
      isCameraPermissionAllowed,
      isMicrophonePermissionAllowed,
    };
  }, [isCameraPermissionAllowed, isMicrophonePermissionAllowed]);

  useEffect(() => {
    if (micOn) {
      audioTrackRef.current = audioTrack;
      startMuteListener();
    }
  }, [micOn, audioTrack]);

  useEffect(() => {
    if (webcamOn) {
      videoTrackRef.current = videoTrack;

      var isPlaying =
        videoPlayerRef.current.currentTime > 0 &&
        !videoPlayerRef.current.paused &&
        !videoPlayerRef.current.ended &&
        videoPlayerRef.current.readyState >
          videoPlayerRef.current.HAVE_CURRENT_DATA;

      if (videoTrack) {
        const videoSrcObject = new MediaStream([videoTrack]);

        if (videoPlayerRef.current) {
          videoPlayerRef.current.srcObject = videoSrcObject;
          if (videoPlayerRef.current.pause && !isPlaying) {
            videoPlayerRef.current
              .play()
              .catch((error) => console.log("error", error));
          }
        }
      } else {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.srcObject = null;
        }
      }
    }
  }, [webcamOn, videoTrack]);

  useEffect(() => {
    getCameraDevices(
      permissonAvaialble,
      getCameras,
      setSelectedWebcam,
      setDevices
    );
  }, [isCameraPermissionAllowed]);

  useEffect(() => {
    getAudioDevices(
      permissonAvaialble,
      getMicrophones,
      getPlaybackDevices,
      startMuteListener,
      setSelectedSpeaker,
      setSelectedMic,
      setDevices
    );
  }, [isMicrophonePermissionAllowed]);

  useEffect(() => {
    checkMediaPermission();
    return () => {};
  }, []);

  const changeWebcam = async (deviceId) => {
    if (webcamOn) {
      const currentvideoTrack = videoTrackRef.current;
      if (currentvideoTrack) {
        currentvideoTrack.stop();
      }

      const stream = await getVideoTrack({
        webcamId: deviceId,
      });
      setCustomVideoStream(stream);
      const videoTracks = stream?.getVideoTracks();
      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
    }
  };
  const changeMic = async (deviceId) => {
    if (micOn) {
      const currentAudioTrack = audioTrackRef.current;
      currentAudioTrack && currentAudioTrack.stop();
      const stream = await getAudioTrack({
        micId: deviceId,
      });
      setCustomAudioStream(stream);
      const audioTracks = stream?.getAudioTracks();
      const audioTrack = audioTracks.length ? audioTracks[0] : null;
      clearInterval(audioAnalyserIntervalRef.current);
      setAudioTrack(audioTrack);
    }
  };

  const getDefaultMediaTracks = async ({ mic, webcam }) => {
    if (mic) {
      const stream = await getAudioTrack({
        micId: selectedMic.id,
      });
      setCustomAudioStream(stream);
      const audioTracks = stream?.getAudioTracks();
      const audioTrack = audioTracks?.length ? audioTracks[0] : null;
      setAudioTrack(audioTrack);
    }

    if (webcam) {
      const stream = await getVideoTrack({
        webcamId: selectedWebcam.id,
      });
      setCustomVideoStream(stream);
      const videoTracks = stream?.getVideoTracks();
      const videoTrack = videoTracks?.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
    }
  };

  async function startMuteListener() {
    const currentAudioTrack = audioTrackRef.current;
    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }
      currentAudioTrack.addEventListener("mute", () => {
        setDlgMuted(true);
      });
    }
  }

  async function requestAudioVideoPermission(mediaType) {
    try {
      const permission = await requestPermission(mediaType);

      if (mediaType == Constants.permission.AUDIO) {
        setIsMicrophonePermissionAllowed(
          permission.get(Constants.permission.AUDIO)
        );
      }

      if (mediaType == Constants.permission.VIDEO) {
        setIsCameraPermissionAllowed(
          permission.get(Constants.permission.VIDEO)
        );
      }

      if (permission.get(Constants.permission.AUDIO)) {
        setMicOn(true);
        getDefaultMediaTracks({ mic: true, webcam: false });
      }

      if (permission.get(Constants.permission.VIDEO)) {
        setWebcamOn(true);
        getDefaultMediaTracks({ mic: false, webcam: true });
      }
    } catch (ex) {
      console.log("Error in requestPermission ", ex);
    }
  }
  function onDeviceChanged() {
    setDidDeviceChange(true);
    getCameraDevices(
      permissonAvaialble,
      getCameras,
      setSelectedWebcam,
      setDevices
    );
    getAudioDevices(
      permissonAvaialble,
      getMicrophones,
      getPlaybackDevices,
      startMuteListener,
      setSelectedSpeaker,
      setSelectedMic,
      setDevices
    );
    getDefaultMediaTracks({ mic: micRef.current, webcam: webcamRef.current });
  }

  const checkMediaPermission = async () => {
    const checkAudioVideoPermission = await checkPermissions();
    const cameraPermissionAllowed = checkAudioVideoPermission.get(
      Constants.permission.VIDEO
    );
    const microphonePermissionAllowed = checkAudioVideoPermission.get(
      Constants.permission.AUDIO
    );

    setIsCameraPermissionAllowed(cameraPermissionAllowed);
    setIsMicrophonePermissionAllowed(microphonePermissionAllowed);

    if (microphonePermissionAllowed) {
      setMicOn(true);
      getDefaultMediaTracks({ mic: true, webcam: false });
    } else {
      await requestAudioVideoPermission(Constants.permission.AUDIO);
    }
    if (cameraPermissionAllowed) {
      setWebcamOn(true);
      getDefaultMediaTracks({ mic: false, webcam: true });
    } else {
      await requestAudioVideoPermission(Constants.permission.VIDEO);
    }
  };

  return (
    <div className="fixed inset-0">
      <div className="overflow-y-auto flex flex-col flex-1 h-screen bg-gray-800">
        <div className="flex flex-1 flex-col md:flex-row items-center justify-center md:m-[72px] m-16">
          <div className="container grid  md:grid-flow-col grid-flow-row ">
            <div className="grid grid-cols-12">
              <div className="md:col-span-7 2xl:col-span-7 col-span-12">
                <div className="flex items-center justify-center p-1.5 sm:p-4 lg:p-6">
                  <div className="relative w-full md:pl-4 sm:pl-10 pl-5  md:pr-4 sm:pr-10 pr-5">
                    <div className="w-full relative h-[55vh]">
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={videoPlayerRef}
                        controls={false}
                        className={
                          "rounded-[10px] h-full w-full object-cover flex items-center justify-center flip bg-[#1c1c1c]"
                        }
                      />

                      {!isMobile ? (
                        <>
                          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                            {!webcamOn ? (
                              <p className="text-xl xl:text-lg 2xl:text-xl text-white">
                                The camera is off
                              </p>
                            ) : null}
                          </div>
                        </>
                      ) : null}

                      <div className="absolute xl:bottom-6 bottom-4 left-0 right-0">
                        <div className="container grid grid-flow-col space-x-4 items-center justify-center md:-m-2">
                          {isMicrophonePermissionAllowed ? (
                            <ButtonWithTooltip
                              onClick={() =>
                                _toggleMic(
                                  audioTrackRef,
                                  micOn,
                                  setAudioTrack,
                                  setCustomAudioStream,
                                  setMicOn,
                                  getDefaultMediaTracks
                                )
                              }
                              onState={micOn}
                              mic={true}
                              OnIcon={<IoMicSharp />}
                              OffIcon={<IoMicOffSharp />}
                            />
                          ) : (
                            <MicPermissionDenied />
                          )}

                          {isCameraPermissionAllowed ? (
                            <ButtonWithTooltip
                              onClick={() =>
                                _toggleWebcam(
                                  videoTrackRef,
                                  webcamOn,
                                  setVideoTrack,
                                  setCustomVideoStream,
                                  setWebcamOn,
                                  getDefaultMediaTracks
                                )
                              }
                              onState={webcamOn}
                              mic={false}
                              OnIcon={<HiVideoCamera />}
                              OffIcon={<HiVideoCameraSlash />}
                            />
                          ) : (
                            <CameraPermissionDenied />
                          )}
                        </div>
                      </div>
                    </div>

                    {!isMobile && (
                      <>
                        <div className="flex mt-3">
                          <DropDown
                            mics={mics}
                            changeMic={changeMic}
                            customAudioStream={customAudioStream}
                            audioTrack={audioTrack}
                            micOn={micOn}
                            didDeviceChange={didDeviceChange}
                            setDidDeviceChange={setDidDeviceChange}
                          />
                          <DropDownSpeaker speakers={speakers} />
                          <DropDownCam
                            changeWebcam={changeWebcam}
                            webcams={webcams}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 2xl:col-span-5 col-span-12 md:relative">
                <div className="flex flex-1 flex-col items-center justify-center xl:m-16 lg:m-6 md:mt-9 lg:mt-14 xl:mt-20 mt-3 md:absolute md:left-0 md:right-0 md:top-0 md:bottom-0">
                  <MeetingDetailsScreen
                    participantName={participantName}
                    setParticipantName={setParticipantName}
                    videoTrack={videoTrack}
                    setVideoTrack={setVideoTrack}
                    onClickStartMeeting={onClickStartMeeting}
                    onClickJoin={async (id) => {
                      const token = await getToken();
                      const { meetingId, err } = await validateMeeting({
                        roomId: id,
                        token,
                      });
                      if (meetingId === id) {
                        setToken(token);
                        setMeetingId(id);
                        onClickStartMeeting();
                      } else {
                        toast.error(`${err}`);
                      }
                    }}
                    _handleOnCreateMeeting={async () => {
                      const token = await getToken();
                      const { meetingId, err } = await createMeeting({ token });

                      if (meetingId) {
                        setToken(token);
                        setMeetingId(meetingId);
                      }
                      return { meetingId: meetingId, err: err };
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmBox
        open={dlgMuted}
        successText="OKAY"
        onSuccess={() => {
          setDlgMuted(false);
        }}
        title="System mic is muted"
        subTitle="You're default microphone is muted, please unmute it or increase audio
            input volume from system settings."
      />
      <ConfirmBox
        open={dlgDevices}
        successText="DISMISS"
        onSuccess={() => {
          setDlgDevices(false);
        }}
        title="Mic or webcam not available"
        subTitle="Please connect a mic and webcam to speak and share your video in the meeting. You can also join without them."
      />
    </div>
  );
};
