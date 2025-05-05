import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import fileUpload from "express-fileupload"
import path from "path";
import cors from "cors"

import { connectDB } from './lib/db.js';

import userRoutes from './routers/user.route.js';
import adminRoutes from './routers/admin.route.js';
import authRoutes from './routers/auth.route.js';
import songRoutes from './routers/song.route.js';
import albumRoutes from './routers/album.route.js';
import statRoutes from './routers/stat.route.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;



app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json()); //to parse req.body
app.use(clerkMiddleware()); // this will add auth to res obj => req.auth.userId

app.use(
    fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits:{
        fileSize: 10 * 1024 * 1024 //10MB max file size
    }
})); //

app.use("/api/users", userRoutes),
app.use("/api/admin", adminRoutes),
app.use("/api/auth", authRoutes),
app.use("/api/songs", songRoutes),
app.use("/api/albums", albumRoutes),
app.use("/api/stats", statRoutes),

app.use((err,req,res, next) =>{
    res.status(500).json({message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message});
})

app.listen(PORT, () => {
    console.log('server running on port ' + PORT);
    connectDB();
});