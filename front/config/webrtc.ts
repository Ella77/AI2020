export const RTCPeerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};
type RTCPeerConnectionConfigType = {
  urls: string;
};

export const getUserMediaContraints = {
  video: false,
  audio: true
};
