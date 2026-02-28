import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = mongoose.connect(`${process.env.MONGODB_URL}`)
.then(response => {
    if (response) console.log('database connected');
}).catch(error => {
    if (error) console.log('failed to connect database');
});

export default db;