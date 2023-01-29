import * as fp from 'fingerpose';

const fingers = [
  fp.Finger.Thumb,
  fp.Finger.Index,
  fp.Finger.Middle,
  fp.Finger.Ring,
  fp.Finger.Pinky,
];

const ThumbsDownGesture = new fp.GestureDescription('thumbs_down');
ThumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
ThumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown);
ThumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.8);
ThumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.8);
for (const finger of fingers.slice(1)) {
  ThumbsDownGesture.addCurl(finger, fp.FingerCurl.FullCurl, 0.9);
  ThumbsDownGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.8);
}

const WaveGesture = new fp.GestureDescription('wave');
WaveGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl);
for (const finger of fingers) {
  WaveGesture.addCurl(finger, fp.FingerCurl.NoCurl, 0.8);
}

const CallMeGesture = new fp.GestureDescription('call_me');
CallMeGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.9);
CallMeGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 0.9);
for (const finger of fingers.slice(1, 3)) {
  CallMeGesture.addCurl(finger, fp.FingerCurl.FullCurl, 0.9);
  CallMeGesture.addCurl(finger, fp.FingerCurl.HalfCurl, 0.8);
}

const OkGesture = new fp.GestureDescription('ok');
OkGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.9);
OkGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.8);
OkGesture.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.8);
OkGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 0.7);
for (const finger of fingers.slice(2)) {
  OkGesture.addCurl(finger, fp.FingerCurl.NoCurl, 0.9);
}

export const GE = new fp.GestureEstimator([
  fp.Gestures.VictoryGesture,
  fp.Gestures.ThumbsUpGesture,
  ThumbsDownGesture,
  WaveGesture,
  CallMeGesture,
  OkGesture,
]);
