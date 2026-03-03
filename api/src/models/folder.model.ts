import mongoose, { Schema, Types } from "mongoose";

export type IFolder = {
    created_at: string;
    folder_name: string;
    files: {
        file_id: Types.ObjectId;
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        url: string;
    }[];
    user_id: Types.ObjectId;
}

const folderSchema = new Schema<IFolder>({
    created_at: { type: String, required: true },
    folder_name: { type: String, required: true },
    files: [{
        file_id: { type: Schema.Types.ObjectId },
        file_name: { type: String },
        file_type: { type: String },
        public_id: { type: String },
        resource_type: { type: String },
        url: { type: String }
    }],
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const Folder = mongoose.model<IFolder>('folders', folderSchema, 'folders');