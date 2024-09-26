/**
 * Extracts a null-terminated string from a Uint8Array.
 *
 * @param {Uint8Array} byteArray - The input byte array containing the null-terminated string.
 * @returns {string} The extracted string in UTF-8 format.
 */
const extractNullTerminatedString = (byteArray: Uint8Array): string => {
  const nullTerminatorIndex = byteArray.indexOf(0);

  // If no null terminator is found, use the full array length
  const endIndex =
    nullTerminatorIndex !== -1 ? nullTerminatorIndex : byteArray.length;

  return byteArray.subarray(0, endIndex).toString();
};

export default extractNullTerminatedString;
