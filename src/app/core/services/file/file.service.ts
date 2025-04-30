import { Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  Storage,
  uploadBytes,
  UploadResult
} from '@angular/fire/storage';
import { FileInfo } from 'app/core/services/file/file.types';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private storage: Storage) {}

  /**
   * Upload a file to Firebase Storage
   *
   * @param file The file to upload
   * @param path The path to store the file
   * @param storageRoot The root directory in storage
   * @returns Promise with the download URL
   */
  async uploadFile(
    file: File,
    path: string = 'default',
    storageRoot: string = 'files'
  ): Promise<string> {
    try {
      const uniqueFileName = this.generateUniqueFileName(file.name);
      const filePath = `/${storageRoot}/${path}/${uniqueFileName}`;
      const storageRef = ref(this.storage, filePath);

      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file. Please try again.');
    }
  }

  /**
   * Uploads a file to Firebase Storage and returns a FileInfo object
   *
   * @param file The file to upload
   * @param path The path to store the file
   * @param storageRoot The root directory in storage
   * @returns Promise with FileInfo object
   */
  async uploadFileWithInfo(
    file: File,
    path: string = 'default',
    storageRoot: string = 'files'
  ): Promise<FileInfo> {
    try {
      const uniqueFileName = this.generateUniqueFileName(file.name);
      const filePath = `/${storageRoot}/${path}/${uniqueFileName}`;
      const storageRef = ref(this.storage, filePath);

      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      return {
        fileName: file.name,
        contentType: file.type,
        fileUrl: fileUrl,
        fileSize: file.size,
        uploadedAt: Date.now()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file. Please try again.');
    }
  }

  /**
   * Delete a file from Firebase Storage
   *
   * @param fileUrl The complete URL to the file
   * @returns Promise<void>
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, fileUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file.');
    }
  }

  /**
   * Delete all files in a directory
   *
   * @param path Path to the directory
   * @param storageRoot Root storage directory
   * @returns Promise<void>
   */
  async deleteFilesInDirectory(path: string, storageRoot: string = 'files'): Promise<void> {
    try {
      const dirPath = `/${storageRoot}/${path}`;
      const dirRef = ref(this.storage, dirPath);
      const result = await listAll(dirRef);

      const deletePromises = result.items.map(fileRef => deleteObject(fileRef));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting files in directory:', error);
      throw new Error('Failed to delete files in directory.');
    }
  }

  /**
   * Generates a unique filename to prevent collisions
   *
   * @param originalFileName The original file name
   * @returns A unique file name
   */
  generateUniqueFileName(originalFileName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);

    // Extract file extension
    const lastDotIndex = originalFileName.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : '';

    // Get the base file name without extension
    const baseName =
      lastDotIndex !== -1 ? originalFileName.substring(0, lastDotIndex) : originalFileName;

    // Create a slug from the base name (remove special chars, replace spaces with hyphens)
    const baseNameSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `${baseNameSlug}-${timestamp}-${randomString}${extension}`;
  }

  /**
   * Returns an appropriate icon name based on file MIME type
   *
   * @param mimeType The MIME type of the file
   * @returns Icon name
   */
  getFileIcon(mimeType: string): string {
    if (!mimeType) return 'insert_drive_file';

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'videocam';
    if (mimeType.startsWith('audio/')) return 'audiotrack';

    switch (mimeType) {
      case 'application/pdf':
        return 'picture_as_pdf';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'description';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'table_chart';
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return 'slideshow';
      case 'application/zip':
      case 'application/x-rar-compressed':
      case 'application/x-7z-compressed':
        return 'archive';
      case 'text/plain':
        return 'text_snippet';
      case 'text/html':
      case 'application/xhtml+xml':
        return 'html';
      case 'application/json':
      case 'application/javascript':
      case 'text/javascript':
        return 'code';
      default:
        return 'insert_drive_file';
    }
  }

  /**
   * Formats file size into a human-readable string
   *
   * @param bytes File size in bytes
   * @returns Formatted file size string
   */
  getFormattedFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
