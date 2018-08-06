import * as DetectRtc from "detectrtc";

// More info about browser support: https://caniuse.com/#search=webrtc
// `Edge` browser excluded, because `Edge` not support `RTCDataChannel`.
export const IS_WEB_RTC_SUPPORTED: boolean = DetectRtc.isWebRTCSupported && !DetectRtc.browser.isEdge;
