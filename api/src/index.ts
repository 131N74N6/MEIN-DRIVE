import dns from 'node:dns/promises'
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');
}

import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from 'cors';
import { v2 } from "cloudinary";
import userRoutes from "./routes/user.router";
import fileRoutes from "./routes/file.router";
import authRoutes from './routes/auth.router';
import folderRoutes from './routes/folder.router';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();

app.use(async (_: Request, __: Response, next: NextFunction) => {
    mongoose.connect((`${process.env.MONGODB_URL}`))
    .then(res => {
        if(res) console.log('Database connection succeffully');
    }).catch(err => {
        console.log("Database connection check failed:", err);
    });
    next();
});

v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:4444", 
        "http://localhost:5173", 
        "https://mein-drive-be.vercel.app", 
        "https://mein-drive.vercel.app"
    ]
}));
app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.listen(4444, () => console.log(`server running at http://localhost:4444`));
}

export default app;