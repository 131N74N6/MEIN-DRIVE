import mongoose, { Schema, Types } from "mongoose";

type DataIntrf ={
    category: string;
    created_at: string;
    files: {
        public_id: string;
        url: string;
        resource_type: string;
    };
    file_name: string;
    file_type: string;
    folder_id: Types.ObjectId;
    folder_name: string;
    is_favorited: boolean;
    parent_folder_id: Types.ObjectId;
    user_id: Types.ObjectId;
}

const dataSchema = new Schema<DataIntrf>({
    category: { type: String },
    created_at: { type: String },
    files: {
        public_id: { type: String },
        url: { type: String },
        resource_type: { type: String, enum: ['image', 'video', 'raw'] }
    },
    file_name: { type: String },
    file_type: { type: String },
    folder_id: { type: Schema.Types.ObjectId },
    folder_name: { type: String },
    is_favorited: { type: Boolean, default: false },
    parent_folder_id: { type: Schema.Types.ObjectId },
    user_id: { type: Schema.Types.ObjectId },
});

export const Data = mongoose.model('datas', dataSchema, 'datas');