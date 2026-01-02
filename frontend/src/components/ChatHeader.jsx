import { X, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/callStore";
import { getSocket } from "../lib/socket";
import { getUserMediaStream } from "../lib/media";
import { startWebRTCCall } from "../lib/webrtc";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const {
    startOutgoingCall,
    setLocalStream,
    setRemoteStream,
  } = useCallStore();
  const { authUser } = useAuthStore();
  console.log("🧠 authUser:", authUser);
  console.log("🧠 selectedUser:", selectedUser);


  const handleCall = async (type) => {
    if (!selectedUser?._id) return;

    // ❌ prevent calling offline user
    if (!onlineUsers.includes(selectedUser._id)) {
      toast.error("User is offline");
      return;
    }

    const socket = getSocket();
    if (!socket) {
      toast.error("Socket not connected");
      return;
    }
    console.log("📞 CALL INITIATED");
console.log("Caller (me):", selectedUser?.fullName);
console.log("Receiver (peer):", selectedUser?.fullName);
console.log("Receiver ID:", selectedUser?._id);
console.log("Call type:", type);


    try {
      // 1️⃣ update call state
      startOutgoingCall(selectedUser._id, type, selectedUser.fullName);

      // 2️⃣ get local media (SINGLE source)
      const stream = await getUserMediaStream(type);
      setLocalStream(stream);

      // 3️⃣ start WebRTC offer (caller)
      await startWebRTCCall({
        socket,
        peerUserId: selectedUser._id,
        localStream: stream,
        callType: type,
        callerName: authUser.fullName, // 👈 Aryan

        onTrack: (event) => {
          setRemoteStream(event.streams[0]);
        },
      });
    } catch (err) {
      console.error("Start call failed:", err);
      toast.error("Failed to start call");
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Call + Close buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCall("audio")}
            className="p-2 rounded-full hover:bg-base-200"
            title="Audio Call"
          >
            <Phone className="size-5" />
          </button>

          <button
            onClick={() => handleCall("video")}
            className="p-2 rounded-full hover:bg-base-200"
            title="Video Call"
          >
            <Video className="size-5" />
          </button>

          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
