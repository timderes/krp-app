import extractNullTerminatedString from "../utils/extractNullTerminatedString";

// Function to parse the split data packet
export const parseSplitPacket = (buffer: Buffer): SplitPacket | null => {
  try {
    // Extract null-terminated string for the split data
    const { nullTerminator, nullTerminatorIndex } =
      extractNullTerminatedString(buffer);

    // Create a subarray for the split data
    const splitDataBytes = buffer.subarray(nullTerminatorIndex + 1); // Move past the null-terminated string

    // Read the split status (0 or 1)
    const split = splitDataBytes.readInt32LE(0); // 4 bytes

    // Create the KartSplit object
    const splitData: KartSplit = {
      m_iSplit: splitDataBytes.readInt32LE(4), // 4 bytes
      m_iSplitTime: splitDataBytes.readInt32LE(8), // 4 bytes
      m_iBestDiff: splitDataBytes.readInt32LE(12), // 4 bytes
    };

    // Return the complete SplitPacket object
    return {
      splt: nullTerminator,
      split,
      splitData,
    };
  } catch (error) {
    // console.error("Error parsing split packet:", error);
    return {
      splt: "split",
      split: null,
      splitData: null,
    };
  }
};
