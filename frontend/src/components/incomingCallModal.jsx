import { Phone, PhoneOff, Video } from "lucide-react";
import { useCallStore } from "../store/callStore";
import { getSocket } from "../lib/socket";
import { createPeerConnection } from "../lib/webrtc";
import { getUserMediaStream } from "../lib/media";
import { flushIceCandidates } from "../lib/webrtc";

const IncomingCallModal = () => {
  const {
    isIncoming,
    peerUserId,
    incomingOffer,
    callType,
    acceptCall,
    rejectCall,
    setLocalStream,
    setRemoteStream,
    incomingCallerName,
  } = useCallStore();
  console.log(incomingCallerName);

  if (!isIncoming) return null;

  const socket = getSocket();
  if (!socket) return null;

  const handleAccept = async () => {
    try {
      // 1️⃣ get local media
      const stream = await getUserMediaStream(callType);
      setLocalStream(stream);

      // 2️⃣ create peer connection + ontrack
      const pc = createPeerConnection((event) => {
        setRemoteStream(event.streams[0]);
      });

      // 3️⃣ add local tracks
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // 4️⃣ ICE handling
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            toUserId: peerUserId,
            candidate: e.candidate,
          });
        }
      };

      // 5️⃣ set caller offer
      await pc.setRemoteDescription(incomingOffer);
      await flushIceCandidates();


      // 6️⃣ create & set answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // 7️⃣ update state (opens VideoCallScreen)
      acceptCall();

      // 8️⃣ send answer to caller
      socket.emit("call-accepted", {
        toUserId: peerUserId,
        answer,
      });
    } catch (err) {
      console.error("Accept call failed:", err);
    }
  };

  const handleReject = () => {
    socket.emit("call-ended", {
      toUserId: peerUserId,
    });
    rejectCall();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl shadow-lg w-80 text-center">
        <div className="flex justify-center mb-3">
          {callType === "video" ? (
            <Video className="size-10 text-primary" />
          ) : (
            <Phone className="size-10 text-primary" />
          )}
        </div>

        <h3 className="font-semibold text-lg">
          Incoming {callType} call
        </h3>

        <p className="text-sm text-base-content/70 mt-1">
          {incomingCallerName} is calling you
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={handleReject}
            className="p-4 rounded-full bg-red-500 text-white"
          >
            <PhoneOff />
          </button>

          <button
            onClick={handleAccept}
            className="p-4 rounded-full bg-green-500 text-white"
          >
            <Phone />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
