import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCallStore } from "../store/callStore";
import { getSocket } from "../lib/socket";
import { stopLocalStream } from "../lib/media";
import { closePeerConnection } from "../lib/webrtc";

const VideoCallScreen = () => {
  const {
    isInCall,
    callType,
    localStream,
    remoteStream,
    toggleMute,
    toggleCamera,
    isMuted,
    isCameraOff,
    endCall,
    peerUserId,
  } = useCallStore();

  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const audioRef = useRef(null);


  useEffect(() => {
    if (!localRef.current || !localStream || callType !== "video") return;

    const video = localRef.current;
    video.srcObject = localStream;

    video.onloadedmetadata = () => {
      video.play().catch(() => {});
    };
  }, [localStream, callType]);

  useEffect(() => {
    if (!remoteRef.current || !remoteStream || callType !== "video") return;

    const video = remoteRef.current;
    video.srcObject = remoteStream;

    video.onloadedmetadata = () => {
      video.play().catch(() => {});
    };
  }, [remoteStream, callType]);

  useEffect(() => {
    if (!audioRef.current || !remoteStream || callType !== "audio") return;
  
    audioRef.current.srcObject = remoteStream;
  
    audioRef.current
      .play()
      .catch(() => console.warn("Audio autoplay blocked"));
  }, [remoteStream, callType]);
  

  const socket = getSocket();

  const handleEnd = () => {
    socket?.emit("call-ended", { toUserId: peerUserId });
    stopLocalStream();
    closePeerConnection();
    endCall();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-black transition-opacity ${
        isInCall
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* VIDEO / AUDIO AREA */}
      <div className="flex-1 relative flex items-center justify-center">
        {callType === "video" ? (
          <>
            <video
              ref={remoteRef}
              playsInline
              className="w-full h-full object-cover"
            />

            <video
              ref={localRef}
              muted
              playsInline
              className="w-40 h-40 object-cover rounded-lg absolute bottom-4 right-4 border"
            />
          </>
        ) : (
          <div className="text-white text-lg opacity-80">
            Audio call in progress…
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="p-4 bg-black/70 flex justify-center gap-6">
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-gray-700 text-white"
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        {callType === "video" && (
          <button
            onClick={toggleCamera}
            className="p-3 rounded-full bg-gray-700 text-white"
          >
            {isCameraOff ? <VideoOff /> : <Video />}
          </button>
        )}

        <button
          onClick={handleEnd}
          className="p-3 rounded-full bg-red-600 text-white"
        >
          <PhoneOff />
        </button>
      </div>
      {/* 🔊 AUDIO ELEMENT (required for audio calls) */}
{callType === "audio" && (
  <audio
    ref={audioRef}
    autoPlay
    playsInline
  />
)}

      

    </div>
    
  );
};

export default VideoCallScreen;
