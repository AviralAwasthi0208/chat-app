// import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
// import { useEffect, useRef } from "react";
// import { useCallStore } from "../store/callStore";
// import { getSocket } from "../lib/socket";
// import { stopLocalStream } from "../lib/media";
// import { closePeerConnection } from "../lib/webrtc";
// const { callType } = useCallStore();
// console.log(callType);

// const attachStream = (videoEl, stream) => {
//   if (!videoEl || !stream) return;

//   if (videoEl.srcObject !== stream) {
//     videoEl.srcObject = stream;
//   }

//   const tryPlay = () => {
//     videoEl
//       .play()
//       .catch(() => {
//         // retry on next frame
//         requestAnimationFrame(tryPlay);
//       });
//   };

//   if (videoEl.readyState >= 2) {
//     tryPlay();
//   } else {
//     videoEl.onloadedmetadata = tryPlay;
//   }
// };

// const VideoCallScreen = () => {
//   const {
//     isInCall,
//     localStream,
//     remoteStream,
//     toggleMute,
//     toggleCamera,
//     isMuted,
//     isCameraOff,
//     endCall,
//     peerUserId,
//   } = useCallStore();

//   const localRef = useRef(null);
//   const remoteRef = useRef(null);

//   /* ---------------- STREAM ATTACH (BULLETPROOF) ---------------- */

//   // useEffect(() => {
//   //   attachStream(localRef.current, localStream);
//   // }, [localStream]);

//   // useEffect(() => {
//   //   attachStream(remoteRef.current, remoteStream);
//   // }, [remoteStream]);
//   useEffect(() => {
//     if (callType !== "video") return;
//     attachStream(localRef.current, localStream);
//   }, [localStream, callType]);
  
//   useEffect(() => {
//     if (callType !== "video") return;
//     attachStream(remoteRef.current, remoteStream);
//   }, [remoteStream, callType]);
  
//   const socket = getSocket();

//   /* ---------------- HANDLERS ---------------- */

//   const handleEnd = () => {
//     socket?.emit("call-ended", { toUserId: peerUserId });
//     stopLocalStream();
//     closePeerConnection();
//     endCall();
//   };

//   const handleMute = () => {
//     if (!localStream) return;
//     localStream.getAudioTracks().forEach(
//       (track) => (track.enabled = isMuted)
//     );
//     toggleMute();
//   };

//   const handleCamera = () => {
//     if (!localStream) return;
//     localStream.getVideoTracks().forEach(
//       (track) => (track.enabled = isCameraOff)
//     );
//     toggleCamera();
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex flex-col bg-black transition-opacity ${
//         isInCall ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//       }`}
//     >
//       {/* VIDEO AREA
//       <div className="flex-1 relative">
//         <video
//           ref={remoteRef}
//           playsInline
//           className="w-full h-full object-cover"
//         />

//         <video
//           ref={localRef}
//           muted
//           playsInline
//           className="w-40 h-40 object-cover rounded-lg absolute bottom-4 right-4 border"
//         />
//       </div> */}



//       {/* VIDEO AREA */}
// <div className="flex-1 relative flex items-center justify-center">
//   {callType === "video" ? (
//     <>
//       <video
//         ref={remoteRef}
//         playsInline
//         className="w-full h-full object-cover"
//       />

//       <video
//         ref={localRef}
//         muted
//         playsInline
//         className="w-40 h-40 object-cover rounded-lg absolute bottom-4 right-4 border"
//       />
//     </>
//   ) : (
//     <div className="text-white text-lg opacity-80">
//       Audio Call in Progress…
//     </div>
//   )}
// </div>


//       {/* CONTROLS */}
//       <div className="p-4 bg-black/70 flex justify-center gap-6">
//         <button
//           onClick={handleMute}
//           className="p-3 rounded-full bg-gray-700 text-white"
//         >
//           {isMuted ? <MicOff /> : <Mic />}
//         </button>

//         <button
//           onClick={handleCamera}
//           className="p-3 rounded-full bg-gray-700 text-white"
//         >
//           {isCameraOff ? <VideoOff /> : <Video />}
//         </button>

//         <button
//           onClick={handleEnd}
//           className="p-3 rounded-full bg-red-600 text-white"
//         >
//           <PhoneOff />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoCallScreen;





// import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
// import { useEffect, useRef } from "react";
// import { useCallStore } from "../store/callStore";
// import { getSocket } from "../lib/socket";
// import { stopLocalStream } from "../lib/media";
// import { closePeerConnection } from "../lib/webrtc";

// const VideoCallScreen = () => {
//   const {
//     isInCall,
//     callType,
//     localStream,
//     remoteStream,
//     toggleMute,
//     toggleCamera,
//     isMuted,
//     isCameraOff,
//     endCall,
//     peerUserId,
//   } = useCallStore();

//   const localRef = useRef(null);
//   const remoteRef = useRef(null);

//   // ✅ hooks ALWAYS at top level
//   useEffect(() => {
//     if (!localRef.current || !localStream || callType !== "video") return;

//     const video = localRef.current;
//     video.srcObject = localStream;

//     video.onloadedmetadata = () => {
//       video.play().catch(() => {});
//     };
//   }, [localStream, callType]);

//   useEffect(() => {
//     if (!remoteRef.current || !remoteStream || callType !== "video") return;

//     const video = remoteRef.current;
//     video.srcObject = remoteStream;

//     video.onloadedmetadata = () => {
//       video.play().catch(() => {});
//     };
//   }, [remoteStream, callType]);

//   const socket = getSocket();

//   const handleEnd = () => {
//     socket?.emit("call-ended", { toUserId: peerUserId });
//     stopLocalStream();
//     closePeerConnection();
//     endCall();
//   };

//   if (!isInCall) return null;

//   return (
//     <div className="fixed inset-0 bg-black z-50 flex flex-col">
//       {/* VIDEO / AUDIO AREA */}
//       <div className="flex-1 relative flex items-center justify-center">
//         {callType === "video" ? (
//           <>
//             <video
//               ref={remoteRef}
//               playsInline
//               className="w-full h-full object-cover"
//             />

//             <video
//               ref={localRef}
//               muted
//               playsInline
//               className="w-40 h-40 object-cover rounded-lg absolute bottom-4 right-4 border"
//             />
//           </>
//         ) : (
//           <div className="text-white text-lg opacity-80">
//             Audio call in progress…
//           </div>
//         )}
//       </div>

//       {/* CONTROLS */}
//       <div className="p-4 bg-black/70 flex justify-center gap-6">
//         <button onClick={toggleMute} className="p-3 rounded-full bg-gray-700 text-white">
//           {isMuted ? <MicOff /> : <Mic />}
//         </button>

//         {callType === "video" && (
//           <button onClick={toggleCamera} className="p-3 rounded-full bg-gray-700 text-white">
//             {isCameraOff ? <VideoOff /> : <Video />}
//           </button>
//         )}

//         <button onClick={handleEnd} className="p-3 rounded-full bg-red-600 text-white">
//           <PhoneOff />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VideoCallScreen;






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
