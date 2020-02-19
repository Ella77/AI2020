export const RTCPeerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export const getUserMediaContraints = {
  video: false,
  audio: true
};

export const offerAndAnswerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: false
};
