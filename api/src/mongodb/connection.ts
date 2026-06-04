import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connection = mongoose.connect((`${process.env.MONGODB_URL}`))
.then(res => {
    if (res) console.log('Database connection succeffully');
}).catch(err => {
    console.log("Database connection check failed:", err);
});