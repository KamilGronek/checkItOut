/**
 * Generates a random identifier string for use in attachment storage paths.
 * This helps prevent collisions and organize uploads in a structured manner.
 *
 * @param prefix An optional prefix to add to the beginning of the identifier
 * @param length The length of the random part of the identifier (default: 16)
 * @returns A string in the format "prefix_randomString_timestamp"
 */
export function generateAttachmentDirectory(prefix: string = '', length: number = 16): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const timestamp = Date.now();
  let result = '';

  // Generate random string of specified length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Format: prefix_randomString_timestamp
  const identifier = prefix ? `${prefix}_${result}_${timestamp}` : `${result}_${timestamp}`;

  return identifier;
}
