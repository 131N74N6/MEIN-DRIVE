import express from "express";
import cors from 'cors';
import db from "./config/mongodb";
import userRoutes from "./routes/user.router";
import fileRoutes from "./routes/file.router";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/files', fileRoutes);
app.use('/users', userRoutes);

db.then(() => {
    app.listen(1234, () => console.log(`server running at http://localhost:1234`))
});