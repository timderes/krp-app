/**
 * Extracts a null-terminated string from a Uint8Array and returns both the string and the index of the null terminator.
 *
 * @param {Uint8Array} byteArray - The input byte array containing the null-terminated string.
 * @returns {{ nullTerminator: string, nullTerminatorIndex: number }} An object containing:
 *   - nullTerminator: The extracted string.
 *   - nullTerminatorIndex: The index of the null terminator, or -1 if not found.
 */
const extractNullTerminatedString = (
  byteArray: Uint8Array
): { nullTerminator: string; nullTerminatorIndex: number } => {
  const nullTerminatorIndex = byteArray.indexOf(0);

  // If no null terminator is found, use the full array length
  const endIndex =
    nullTerminatorIndex !== -1 ? nullTerminatorIndex : byteArray.length;

  return {
    nullTerminator: byteArray.subarray(0, endIndex).toString(),
    nullTerminatorIndex,
  };
};

export default extractNullTerminatedString;
