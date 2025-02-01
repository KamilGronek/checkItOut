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
        const imagePath = `/images/${path}/${file.name}`;
        const storageRef = ref(this.storage, imagePath);

        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    }

    async deleteImage(path: string): Promise<void> {
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
    }

    async deleteAllFilesInFolder(path: string): Promise<void> {
        const folderRef = ref(this.storage, `/images/${path}`);
        const result = await listAll(folderRef);

        const deletePromises = result.items.map((fileRef) =>
            deleteObject(fileRef)
        );

        await Promise.all(deletePromises);
    }

    async deleteAllAndUpload(file: File, path: string): Promise<string> {
        await this.deleteAllFilesInFolder(path);
        return await this.uploadImage(file, path);
    }
}
