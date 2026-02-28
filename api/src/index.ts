import express from "express";
import cors from 'cors';
import db from "./database/mongodb";
import userRoutes from "./routes/user.router";
import fileRoutes from "./routes/file.router";
import favoriteRoutes from "./routes/favorited.router";

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:1999", "http://localhost:5173"]
}));
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorited', favoriteRoutes);

db.then(() => {
    app.listen(1999, () => console.log(`server running at http://localhost:1999`))
});