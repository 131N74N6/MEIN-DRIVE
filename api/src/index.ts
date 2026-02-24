import express from "express";
import cors from 'cors';
import db from "./config/mongodb";
import userRoutes from "./routes/user.router";
import fileRoutes from "./routes/file.router";
import favoriteRoutes from "./routes/favorited.router";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorited', favoriteRoutes);

db.then(() => {
    app.listen(1234, () => console.log(`server running at http://localhost:1234`))
});