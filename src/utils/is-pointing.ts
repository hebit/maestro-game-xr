export function isPointing(
  hand: XRHand,
  frame: XRFrame,
  referenceSpace: XRSpace
) {
  const joint = hand.get("wrist");
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

  if (indexDistance < 0.05) return false;

  const otherFingers = [
    "middle-finger-tip",
    "ring-finger-tip",
    "pinky-finger-tip",
  ];

  for (const tipName of otherFingers) {
    const joint = hand.get(tipName as XRHandJoint);
    if (!joint) continue;
    const tipPose = frame.getJointPose?.(joint, referenceSpace)?.transform
      .position;
    if (!tipPose) continue;

    const distance = Math.hypot(
      tipPose.x - wrist.x,
      tipPose.y - wrist.y,
      tipPose.z - wrist.z
    );

    if (distance > 0.09) return false;
  }

  const thumbTip = hand.get("thumb-tip");
  if (thumbTip) {
    const thumbPose = frame.getJointPose?.(thumbTip, referenceSpace)?.transform
      .position;
    if (thumbPose) {
      const thumbDistance = Math.hypot(
        thumbPose.x - wrist.x,
        thumbPose.y - wrist.y,
        thumbPose.z - wrist.z
      );

      const maxThumbDistance = Math.max(indexDistance * 1.6, 0.11);

      if (thumbDistance > maxThumbDistance) return false;
    }
  }

  return true;
}
