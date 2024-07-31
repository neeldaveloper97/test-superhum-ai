import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_AUTH_URL = import.meta.env.VITE_AUTH_URL;

const VIDEOSDK_BASE_URL = import.meta.env.VITE_VIDEOSDK_BASE_URL;
const VIDEOSDK_TOKEN = import.meta.env.VITE_VIDEOSDK_TOKEN;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const getToken = async () => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    console.error(
      "Error: Provide only ONE PARAMETER - either Token or Auth API"
    );
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  } else if (API_AUTH_URL) {
    const res = await fetch(`${API_AUTH_URL}/get-token`, {
      method: "GET",
    });
    const { token } = await res.json();
    return token;
  } else {
    console.error("Error: ", Error("Please add a token or Auth Server URL"));
  }
};

export const createMeeting = async ({ token }) => {
  const url = `${API_BASE_URL}`;
  console.log("url: ", url);
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };
  console.log("url: ", url);
  const response = await fetch(url, options);
  console.log("response: ", response);
  const data = await response.json();

  if (data.meetingId) {
    return { meetingId: data.meetingId, err: null };
  } else {
    return { meetingId: null, err: data.error };
  }
};

export const validateMeeting = async ({ roomId, token }) => {
  const url = `${API_BASE_URL}/validate/${roomId}`;

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response = await fetch(url, options);

  if (response.status === 400) {
    const data = await response.text();
    return { meetingId: null, err: data };
  }

  const data = await response.json();

  if (data.meetingId) {
    return { meetingId: data.meetingId, err: null };
  } else {
    return { meetingId: null, err: data.error };
  }
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://172.30.0.3:5173/`,
    },
  });

  if (error) throw error;
  if (data) {
    toast.success("Signed in");
  }
  return { data, session: data.session };
};

export const startRecordingA = async (roomId) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: VIDEOSDK_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
      config: {
        layout: { type: "SPOTLIGHT", priority: "SPEAKER" },
        mode: "video-and-audio",
      },
    }),
  };
  const url = `https://api.videosdk.live/v2/recordings/start`;
  await fetch(url, options);
};

export const fetchAndStoreMeetingRec = async (room_id, user_id) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: VIDEOSDK_TOKEN,
      "Content-Type": "application/json",
    },
  };
  const url = `${VIDEOSDK_BASE_URL}/recordings?roomId=${room_id}`;
  const response = await fetch(url, options);
  const data = await response.json();
  let recordingId;
  if (data.data.length > 0) {
    recordingId = data.data[data.data.length - 1].id;
    console.log("recordingId: ", recordingId);
    fetchRecording(recordingId, user_id);
  }
};

const fetchRecording = async (recordingId, user_id) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: VIDEOSDK_TOKEN,
      "Content-Type": "application/json",
    },
  };
  const url = `${VIDEOSDK_BASE_URL}/recordings/${recordingId}`;

  const maxAttempts = 10;
  const delayBetweenAttempts = 3000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.file) {
      await insertRecDetails(user_id, data.sessionId, data.roomId, [
        data.file.fileUrl,
      ]);
      return;
    }

    console.log(
      `Attempt ${attempt + 1}: File not ready yet. Retrying in 3 seconds...`
    );
    await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
  }

  console.log("Max attempts reached. File not available.");
};

const insertRecDetails = async (
  user_id,
  session_id,
  room_id,
  recording_links
) => {
  await supabase.from("recordings").insert({
    user_id: user_id,
    session_id: session_id,
    room_id: room_id,
    recording_links: recording_links,
  });
};

export const fetchRecordingsSupabase = async (user_id) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/recordings/${user_id}`,
      options
    );
    const data = await response.json();
    return { data, err: null };
  } catch (error) {
    toast.error("Error while getting the recordings");
    console.error("Error while getting the recordings:", error);
    return { data: null, err: error.message };
  }
};

export const downloadRecInMp3 = async (url, setLoading) => {
  setLoading(true);
  toast("Loading...");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      format: "mp3",
    }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/export`, options);
    console.log("options: ", options);
    const data = await response.json();
    toast.success("Downloading...");
    setLoading(false);
    window.open(data.url, "_blank");
  } catch (error) {
    toast.error("Error while downloading mp3.");
    console.error("Error in downloadRecInMp3:", error);
    return { meetingId: null, err: error.message };
  } finally {
    setLoading(false);
  }
};
