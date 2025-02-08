import { Injectable } from '@angular/core';
import {
    Storage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll,
} from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class ImageService {
    constructor(private storage: Storage) {}

    async uploadImage(file: File, path: string): Promise<string> {
        try {
            const imagePath = `/images/${path}/${file.name}`;
            const storageRef = ref(this.storage, imagePath);

            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image. Please try again.');
        }
    }

    async deleteImage(path: string): Promise<void> {
        try {
            const storageRef = ref(this.storage, `/images/${path}`);
            await deleteObject(storageRef);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Failed to delete image. It may not exist.');
        }
    }

    async deleteAllFilesInFolder(path: string): Promise<void> {
        try {
            const folderRef = ref(this.storage, `/images/${path}`);
            const result = await listAll(folderRef);

            if (result.items.length === 0) {
                console.warn('No files found in folder:', path);
                return;
            }

            const deletePromises = result.items.map((fileRef) => {
                deleteObject(fileRef);
            });

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error deleting files in folder:', error);
            throw new Error('Failed to delete files in the folder.');
        }
    }
}
