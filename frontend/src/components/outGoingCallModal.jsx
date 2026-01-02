import { PhoneOff, Video } from "lucide-react";
import { useCallStore } from "../store/callStore";
import { getSocket } from "../lib/socket";

const OutgoingCallModal = () => {
  const { isCalling, isInCall, endCall, peerUserId,peerUserName } = useCallStore();

  // ❌ hide when call connected
  if (!isCalling || isInCall) return null;

  const socket = getSocket();

  const handleCancel = () => {
    if (socket && peerUserId) {
      socket.emit("call-ended", {
        toUserId: peerUserId,
      });
    }
    endCall();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl w-80 text-center">
        <div className="flex justify-center mb-3">
          <Video className="size-10 text-primary" />
        </div>

        <h3 className="font-semibold text-lg">Calling {peerUserName}...</h3>
        <p className="text-sm text-base-content/70 mt-1">
          Waiting for {peerUserName} to accept
        </p>

        <button
          onClick={handleCancel}
          className="mt-6 p-4 rounded-full bg-red-500 text-white"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default OutgoingCallModal;
