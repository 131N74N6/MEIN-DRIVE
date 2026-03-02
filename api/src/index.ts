import dns from 'node:dns/promises'
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');
}

import express from "express";
import cors from 'cors';
import db from "./database/mongodb";
import userRoutes from "./routes/user.router";
import fileRoutes from "./routes/file.router";
import favoriteRoutes from "./routes/favorited.router";
import { v2 } from "cloudinary";

const app = express();

v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4444", "http://localhost:5173"]
}));
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorited', favoriteRoutes);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        app.listen(4444, () => console.log(`server running at http://localhost:4444`))
    });
}

export default app;