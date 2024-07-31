import { useState, useEffect, useCallback } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { VideoCfcProvider } from "./context/VideoCfcContext";
import { Meeting } from "./components/meeting/Meeting";
import { LeaveScreen } from "./components/meeting/screens/LeaveScreen";
import { JoiningScreen } from "./components/meeting/screens/JoiningScreen";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Recordings } from "./pages/Recordings";
import { Dash } from "./pages/Dash";
import { Navbar } from "./components/navbar/Navbar";
import { Auth } from "./pages/Auth";
import { supabase } from "./api";
import toast from "react-hot-toast";

function App() {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);
  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  const [showLogOut, setShowLogOut] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const redirectToLogin = useCallback(async () => {
    await supabase.auth.signOut();
    return navigate("/auth");
  });

  useEffect(() => {
    async function fetchData() {
      await supabase.auth.getSession().then((ress) => {
        if (ress.data.session) {
          setShowLogOut(true);
          setSession(ress.data.session);
          return;
        } else {
          redirectToLogin();
        }
      });
    }

    fetchData();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error: ", error);
    if (!error) {
      setShowLogOut(false);
      toast.success("Signed out");
      redirectToLogin();
    }
  };

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <>
      <Navbar showLogOut={showLogOut} handleSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Dash />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/meeting"
          element={
            <VideoCfcProvider>
              {isMeetingStarted ? (
                <MeetingProvider
                  config={{
                    meetingId,
                    micEnabled: micOn,
                    webcamEnabled: webcamOn,
                    name: participantName ? participantName : "TestUser",
                    multiStream: true,
                    customCameraVideoTrack: customVideoStream,
                    customMicrophoneAudioTrack: customAudioStream,
                  }}
                  token={token}
                  reinitialiseMeetingOnConfigChange={true}
                  joinWithoutUserInteraction={true}
                >
                  <Meeting
                    onMeetingLeave={() => {
                      setToken("");
                      setMeetingId("");
                      setParticipantName("");
                      setWebcamOn(false);
                      setMicOn(false);
                      setMeetingStarted(false);
                    }}
                    setIsMeetingLeft={setIsMeetingLeft}
                    user={session?.user}
                  />
                </MeetingProvider>
              ) : isMeetingLeft ? (
                <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
              ) : (
                <JoiningScreen
                  participantName={participantName}
                  setParticipantName={setParticipantName}
                  setMeetingId={setMeetingId}
                  setToken={setToken}
                  micOn={micOn}
                  setMicOn={setMicOn}
                  webcamOn={webcamOn}
                  setWebcamOn={setWebcamOn}
                  customAudioStream={customAudioStream}
                  setCustomAudioStream={setCustomAudioStream}
                  customVideoStream={customVideoStream}
                  setCustomVideoStream={setCustomVideoStream}
                  onClickStartMeeting={() => {
                    setMeetingStarted(true);
                  }}
                  startMeeting={isMeetingStarted}
                  setIsMeetingLeft={setIsMeetingLeft}
                />
              )}
            </VideoCfcProvider>
          }
        />
        <Route
          path="/recordings"
          element={<Recordings user={session?.user} />}
        />
      </Routes>
    </>
  );
}

export default App;
