import mongoose, { Schema, Types } from "mongoose";

export type IFolder = {
    created_at: string;
    folder_name: string;
    is_favorited: boolean;
    user_id: Types.ObjectId;
}

const folderSchema = new Schema<IFolder>({
    created_at: { type: String, required: true },
    folder_name: { type: String, required: true },
    is_favorited: { type: Boolean, default: false },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const Folder = mongoose.model<IFolder>('folders', folderSchema, 'folders');