/**
 * Standard file information structure returned by file and image upload components
 * Contains metadata about the uploaded file and its storage location
 */
export interface FileInfo {
  /**
   * Original filename of the uploaded file
   */
  fileName: string;

  /**
   * MIME type of the file (e.g., 'image/jpeg', 'application/pdf')
   */
  contentType: string;

  /**
   * URL where the file is stored/accessible
   */
  fileUrl: string;

  /**
   * Size of the file in bytes
   */
  fileSize: number;

  /**
   * Optional thumbnail URL for image files
   */
  thumbnailUrl?: string;

  /**
   * Timestamp when the file was uploaded
   */
  uploadedAt: number;
}
