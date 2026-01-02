import { create } from "zustand";

export const useCallStore = create((set) => ({
  /* ---------------- CALL STATE ---------------- */
  peerUserName: null,
  callerName: null,


  isCalling: false,    // outgoing call
  isIncoming: false,  // incoming popup
  isInCall: false,    // connected

  callType: null,     // "audio" | "video"
  peerUserId: null,
  incomingOffer: null,
  incomingCallerName: null,


  /* ---------------- MEDIA ---------------- */

  localStream: null,
  remoteStream: null,

  isMuted: false,
  isCameraOff: false,

  /* ---------------- ACTIONS ---------------- */

  // outgoing call (caller)
  startOutgoingCall: (userId, type,userName) =>
    set({
      isCalling: true,
      isIncoming: false,
      isInCall: false,
      callType: type,
      peerUserId: userId,
      peerUserName: userName, // 👈 RECEIVER name

    }),

  // incoming call (receiver)
  setIncomingCall: (userId, offer, type = "video", callerName) =>
    set({
      isIncoming: true,
      isCalling: false,
      isInCall: false,
      callType: type,
      peerUserId: userId,
      incomingOffer: offer,
      incomingCallerName: callerName, // 👈 CALLER name

    }),

  // accept incoming call
  acceptCall: () =>
    set({
      isIncoming: false,
      isCalling: false,
      isInCall: true,
    }),

  // reject incoming call
  rejectCall: () =>
    set({
      isIncoming: false,
      isCalling: false,
      isInCall: false,
      peerUserId: null,
      callType: null,
      incomingOffer: null,
    }),

  // caller side when answer arrives
  setInCall: () =>
    set({
      isCalling: false,
      isIncoming: false,
      isInCall: true,
    }),

  /* ---------------- MEDIA HELPERS ---------------- */

  // 🔥 CRITICAL: do NOT recreate stream elsewhere
  setLocalStream: (stream) =>
    set({
      localStream: stream,
      isMuted: false,
      isCameraOff: false,
    }),

  setRemoteStream: (stream) => set({ remoteStream: stream }),

  toggleMute: () =>
    set((s) => {
      if (s.localStream) {
        s.localStream
          .getAudioTracks()
          .forEach((t) => (t.enabled = s.isMuted));
      }
      return { isMuted: !s.isMuted };
    }),

  toggleCamera: () =>
    set((s) => {
      if (s.localStream) {
        s.localStream
          .getVideoTracks()
          .forEach((t) => (t.enabled = s.isCameraOff));
      }
      return { isCameraOff: !s.isCameraOff };
    }),

  /* ---------------- END / RESET ---------------- */

  endCall: () =>
    set((s) => {
      if (s.localStream) {
        s.localStream.getTracks().forEach((t) => t.stop());
      }
      return {
        isCalling: false,
        isIncoming: false,
        isInCall: false,
        peerUserId: null,
        callType: null,
        incomingOffer: null,
        localStream: null,
        remoteStream: null,
        isMuted: false,
        isCameraOff: false,
      };
    }),

  resetCall: () =>
    set({
      isCalling: false,
      isIncoming: false,
      isInCall: false,
      callType: null,
      peerUserId: null,
      incomingOffer: null,
    }),
}));
