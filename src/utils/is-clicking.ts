export function isClicking(
  hand: XRHand,
  frame: XRFrame,
  referenceSpace: XRSpace
) {
  const joint = hand.get("thumb-tip");
  const joint2 = hand.get("index-finger-tip");
  if (!joint || !joint2) return null;
  const wrist = frame.getJointPose?.(joint, referenceSpace)?.transform.position;
  const indexTip = frame.getJointPose?.(joint2, referenceSpace)?.transform
    .position;

  if (!indexTip || !wrist) return false;

  const indexDistance = Math.hypot(
    indexTip.x - wrist.x,
    indexTip.y - wrist.y,
    indexTip.z - wrist.z
  );

  if (indexDistance < 0.04) return true;

  return false;
}
