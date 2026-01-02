// let peerConnection = null;
// let pendingIceCandidates = [];

// export const createPeerConnection = (onTrack, socket, peerUserId) => {
//   peerConnection = new RTCPeerConnection({
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   });

//   if (onTrack) {
//     peerConnection.ontrack = onTrack;
//   }

//   peerConnection.onicecandidate = (e) => {
//     if (e.candidate) {
//       socket.emit("ice-candidate", {
//         toUserId: peerUserId,
//         candidate: e.candidate,
//       });
//     }
//   };

//   return peerConnection;
// };

// export const startWebRTCCall = async ({
//   socket,
//   peerUserId,
//   localStream,
//   onTrack,
//   callType,
//   callerName,
// }) => {
//   const pc = createPeerConnection(onTrack, socket, peerUserId);

//   localStream.getTracks().forEach((track) =>
//     pc.addTrack(track, localStream)
//   );

//   const offer = await pc.createOffer();
//   await pc.setLocalDescription(offer);

//   socket.emit("outgoing-call", {
//     toUserId: peerUserId,
//     offer,
//     callType,
//     callerName,
//   });
// };

// export const getPeerConnection = () => peerConnection;

// export const addIceCandidateSafely = async (candidate) => {
//   if (!peerConnection) return;

//   if (peerConnection.remoteDescription) {
//     await peerConnection.addIceCandidate(candidate);
//   } else {
//     pendingIceCandidates.push(candidate);
//   }
// };

// export const flushIceCandidates = async () => {
//   if (!peerConnection?.remoteDescription) return;

//   for (const c of pendingIceCandidates) {
//     await peerConnection.addIceCandidate(c);
//   }
//   pendingIceCandidates = [];
// };

// export const closePeerConnection = () => {
//   if (peerConnection) {
//     peerConnection.close();
//     peerConnection = null;
//     pendingIceCandidates = [];
//   }
// };





let peerConnection = null;
let pendingIceCandidates = [];

/* 🔥 XIRSYS ICE SERVERS */
const ICE_SERVERS = [
  {
    urls: ["stun:bn-turn1.xirsys.com"],
  },
  {
    username: import.meta.env.VITE_XIRSYS_USERNAME,
    credential: import.meta.env.VITE_XIRSYS_CREDENTIAL,
    urls: [
      "turn:bn-turn1.xirsys.com:80?transport=udp",
      "turn:bn-turn1.xirs.com:3478?transport=udp",
      "turn:bn-turn1.xirsys.com:80?transport=tcp",
      "turn:bn-turn1.xirsys.com:3478?transport=tcp",
      "turns:bn-turn1.xirsys.com:443?transport=tcp",
      "turns:bn-turn1.xirsys.com:5349?transport=tcp",
    ],
  },
];

export const createPeerConnection = (onTrack, socket, peerUserId) => {
  peerConnection = new RTCPeerConnection({
    iceServers: ICE_SERVERS,
  });

  if (onTrack) {
    peerConnection.ontrack = onTrack;
  }

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("ice-candidate", {
        toUserId: peerUserId,
        candidate: e.candidate,
      });
    }
  };

  return peerConnection;
};

export const startWebRTCCall = async ({
  socket,
  peerUserId,
  localStream,
  onTrack,
  callType,
  callerName,
}) => {
  const pc = createPeerConnection(onTrack, socket, peerUserId);

  localStream.getTracks().forEach((track) =>
    pc.addTrack(track, localStream)
  );

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  socket.emit("outgoing-call", {
    toUserId: peerUserId,
    offer,
    callType,
    callerName,
  });
};

export const getPeerConnection = () => peerConnection;

export const addIceCandidateSafely = async (candidate) => {
  if (!peerConnection) return;

  if (peerConnection.remoteDescription) {
    await peerConnection.addIceCandidate(candidate);
  } else {
    pendingIceCandidates.push(candidate);
  }
};

export const flushIceCandidates = async () => {
  if (!peerConnection?.remoteDescription) return;

  for (const c of pendingIceCandidates) {
    await peerConnection.addIceCandidate(c);
  }
  pendingIceCandidates = [];
};

export const closePeerConnection = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
    pendingIceCandidates = [];
  }
};
