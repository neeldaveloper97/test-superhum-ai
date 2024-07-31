export const _toggleWebcam = (
  videoTrackRef,
  webcamOn,
  setVideoTrack,
  setCustomVideoStream,
  setWebcamOn,
  getDefaultMediaTracks
) => {
  const videoTrack = videoTrackRef.current;

  if (webcamOn) {
    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(null);
      setCustomVideoStream(null);
      setWebcamOn(false);
    }
  } else {
    getDefaultMediaTracks({ mic: false, webcam: true });
    setWebcamOn(true);
  }
};

export const _toggleMic = (
  audioTrackRef,
  micOn,
  setAudioTrack,
  setCustomAudioStream,
  setMicOn,
  getDefaultMediaTracks
) => {
  const audioTrack = audioTrackRef.current;

  if (micOn) {
    if (audioTrack) {
      audioTrack.stop();
      setAudioTrack(null);
      setCustomAudioStream(null);
      setMicOn(false);
    }
  } else {
    getDefaultMediaTracks({ mic: true, webcam: false });
    setMicOn(true);
  }
};

export const getAudioDevices = async (
  permissonAvaialble,
  getMicrophones,
  getPlaybackDevices,
  startMuteListener,
  setSelectedSpeaker,
  setSelectedMic,
  setDevices
) => {
  try {
    if (permissonAvaialble.current?.isMicrophonePermissionAllowed) {
      let mics = await getMicrophones();
      let speakers = await getPlaybackDevices();
      const hasMic = mics.length > 0;
      if (hasMic) {
        startMuteListener();
      }
      setSelectedSpeaker({
        id: speakers[0]?.deviceId,
        label: speakers[0]?.label,
      });
      setSelectedMic({ id: mics[0]?.deviceId, label: mics[0]?.label });
      setDevices((devices) => {
        return { ...devices, mics, speakers };
      });
    }
  } catch (err) {
    console.log("Error in getting audio devices", err);
  }
};

export const getCameraDevices = async (
  permissonAvaialble,
  getCameras,
  setSelectedWebcam,
  setDevices
) => {
  try {
    if (permissonAvaialble.current?.isCameraPermissionAllowed) {
      let webcams = await getCameras();
      setSelectedWebcam({
        id: webcams[0]?.deviceId,
        label: webcams[0]?.label,
      });
      setDevices((devices) => {
        return { ...devices, webcams };
      });
    }
  } catch (err) {
    console.log("Error in getting camera devices", err);
  }
};
