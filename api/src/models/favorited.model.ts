import mongoose, { Schema, Types } from "mongoose";

interface IFavoritedFiles {
    created_at: string;
    files: {
        public_id: string;
        url: string;
        resource_type: string;
    };
    file_id: Types.ObjectId;
    file_name: string;
    file_type: string;
    user_id: Types.ObjectId;
}

const favoritedSchema = new Schema<IFavoritedFiles>({
    created_at: { type: String, required: true },
    files: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        resource_type: { type: String, required: true, enum: ['image', 'video', 'raw'] }
    },
    file_id: { type: Schema.Types.ObjectId, required: true },
    file_name: { type: String, required: true },
    file_type: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

const Favorited = mongoose.model<IFavoritedFiles>('favorited', favoritedSchema, 'favorited');

export { IFavoritedFiles, Favorited }