import mongoose, { Schema, Types } from "mongoose";

type IFile ={
    created_at: string;
    files: {
        public_id: string;
        url: string;
    };
    file_name: string;
    user_id: Types.ObjectId;
}

const fileSchema = new Schema<IFile>({
    created_at: { type: String, required: true },
    files: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    file_name: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
});

const File = mongoose.model('files', fileSchema, 'files');

export { File, IFile }