import type { UploadResult } from "../models/fileModel";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(chosenFile: File, folderName: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', `${Date.now()}`);
    formData.append('file', chosenFile);
    formData.append('folder', folderName);

    const request = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
    });

    const response = await request.json();
    
    return {
        file_name: chosenFile.name,
        file_type: chosenFile.type,
        public_id: response.public_id,
        resource_type: response.resource_type,
        url: response.secure_url,
    }
}

export { uploadToCloudinary }