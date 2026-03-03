import mongoose, { Schema, Types } from "mongoose";

export type IFolder = {
    created_at: string;
    folder_name: string;
    files: {
        public_id: string;
        url: string;
        resource_type: string;
    }[];
    user_id: Types.ObjectId;
}

const folderSchema = new Schema<IFolder>({
    created_at: { type: String, required: true },
    folder_name: { type: String, required: true },
    files: [{
        public_id: { type: String },
        url: { type: String },
        resource_type: { type: String }
    }],
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const Folder = mongoose.model<IFolder>('folders', folderSchema, 'folders');