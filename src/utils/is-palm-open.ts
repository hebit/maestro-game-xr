type PalmState = {
  open: boolean;
  orientation: "up" | "down" | "unknown";
};

export function isPalmOpen(
  hand: XRHand,
  frame: XRFrame,
  referenceSpace: XRSpace,
  side: "left" | "right"
): PalmState | null {
  const wristJoint = hand.get("wrist");
  const indexBase = hand.get("index-finger-metacarpal");
  const pinkyBase = hand.get("pinky-finger-metacarpal");

  if (!wristJoint || !indexBase || !pinkyBase) return null;

  const wristPose = frame.getJointPose?.(wristJoint, referenceSpace);
  const indexPose = frame.getJointPose?.(indexBase, referenceSpace);
  const pinkyPose = frame.getJointPose?.(pinkyBase, referenceSpace);

  if (!wristPose || !indexPose || !pinkyPose) return null;

  const wrist = wristPose.transform.position;
  const index = indexPose.transform.position;
  const pinky = pinkyPose.transform.position;

  const v1 = {
    x: index.x - wrist.x,
    y: index.y - wrist.y,
    z: index.z - wrist.z,
  };

  const v2 = {
    x: pinky.x - wrist.x,
    y: pinky.y - wrist.y,
    z: pinky.z - wrist.z,
  };

  const normal = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };

  let orientation: PalmState["orientation"] = "unknown";
  if (normal.y > 0) orientation = side === "right" ? "up" : "down";
  else if (normal.y < 0) orientation = side === "right" ? "down" : "up";

  let extendedCount = 0;
  const fingers = [
    "thumb-tip",
    "index-finger-tip",
    "middle-finger-tip",
    "ring-finger-tip",
    "pinky-finger-tip",
  ] as XRHandJoint[];

  const requiredThumbFingerDistance = 0.085;
  const requiredOthersFingerDistance = 0.14;

  for (const jointName of fingers) {
    const tip = hand.get(jointName);
    if (!tip) continue;

    const tipPose = frame.getJointPose?.(tip, referenceSpace);
    if (!tipPose) continue;

    const { x, y, z } = tipPose.transform.position;
    const dx = x - wrist.x;
    const dy = y - wrist.y;
    const dz = z - wrist.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (
      (jointName === "thumb-tip" && distance >= requiredThumbFingerDistance) ||
      (jointName !== "thumb-tip" && distance >= requiredOthersFingerDistance)
    ) {
      extendedCount++;
    }
  }

  return {
    open: extendedCount === 5,
    orientation,
  };
}
