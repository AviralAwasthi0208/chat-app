let localStream = null;

/**
 * Get (or reuse) user media stream
 * Ensures SAME stream is used everywhere
 */
export const getUserMediaStream = async (callType = "video") => {
  // ✅ reuse existing stream
  if (localStream) {
    return localStream;
  }

  const constraints = {
    audio: true,
    video:
      callType === "video"
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          }
        : false,
  };

  try {
    console.log("🎥 Requesting media:", constraints);

    localStream = await navigator.mediaDevices.getUserMedia(constraints);

    console.log("✅ Media granted:", {
      audioTracks: localStream.getAudioTracks().length,
      videoTracks: localStream.getVideoTracks().length,
    });

    return localStream;
  } catch (err) {
    console.error("❌ getUserMedia failed:", err);
    throw err;
  }
};

/**
 * Always read stream from here
 */
export const getLocalStream = () => localStream;

/**
 * Stop & cleanup media
 */
export const stopLocalStream = () => {
  if (!localStream) return;

  localStream.getTracks().forEach((track) => track.stop());
  localStream = null;
};
