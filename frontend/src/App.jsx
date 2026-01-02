import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useCallStore } from "./store/callStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import IncomingCallModal from "./components/incomingCallModal";
import OutgoingCallModal from "./components/outGoingCallModal";
import VideoCallScreen from "./components/videoCallScreen";
import { flushIceCandidates, addIceCandidateSafely } from "./lib/webrtc";

import {
  createPeerConnection,
  getPeerConnection,
  closePeerConnection,
} from "./lib/webrtc";

import { stopLocalStream } from "./lib/media";

import { connectSocket } from "./lib/socket";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  const {
    setIncomingCall,
    setInCall,
    resetCall,
    setRemoteStream,
  } = useCallStore();

  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* ---------------- SOCKET + SIGNALING ---------------- */

  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);
    if (!socket) return;

    /* 📞 Incoming call (callee) */
    const handleIncomingCall = async ({ fromUserId, offer, callType ,callerName }) => {
      console.log("Incoming call from:", fromUserId);

      // 1️⃣ show incoming modal
      setIncomingCall(fromUserId, offer, callType, callerName);

      // 2️⃣ prepare peer connection EARLY
      const pc = createPeerConnection((event) => {
        setRemoteStream(event.streams[0]);
      });

      // 3️⃣ ICE candidates
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            toUserId: fromUserId,
            candidate: e.candidate,
          });
        }
      };

      // 4️⃣ set offer
      await pc.setRemoteDescription(offer);
    };

    /* ✅ Caller side – answer received */
    const handleCallAccepted = async ({ answer }) => {
      const pc = getPeerConnection();
      if (!pc) return;

      await pc.setRemoteDescription(answer);
      await flushIceCandidates(); // 🔥 IMPORTANT

      setInCall(); // opens VideoCallScreen
    };

    /* ❄ ICE candidate */
    const handleIceCandidate = async ({ candidate }) => {
      const pc = getPeerConnection();
      if (pc && candidate) {
        await addIceCandidateSafely(candidate);
      }
    };

    /* ❌ Call ended */
    const handleCallEnded = () => {
      stopLocalStream();
      closePeerConnection();
      resetCall();
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("call-ended", handleCallEnded);
    };
  }, [authUser, setIncomingCall, setInCall, resetCall, setRemoteStream]);

  /* ---------------- LOADING ---------------- */

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* 🔥 CALL LAYERS */}
      <IncomingCallModal />
      <OutgoingCallModal />
      <VideoCallScreen />

      <Toaster />
    </div>
  );
};

export default App;
