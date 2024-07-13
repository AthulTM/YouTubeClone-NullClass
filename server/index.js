import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser from "body-parser";
import userRoutes from './routes/user.js';
import videoRoutes from './routes/video.js';
import commentsRoutes from './routes/comments.js';
import path from 'path';
import { createServer } from "http";
import socketServer from "./socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
socketServer(server);

const corsOptions ={
    origin: true,
    methods: ["POST", "GET","PATCH"],
    credentials:false,          
    optionSuccessStatus:200
}
app.use(cors(corsOptions))

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use('/uploads', express.static(path.join('uploads')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send("hello");
});
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/comment', commentsRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server Running on the PORT ${PORT}`);
});

const DB_URL = process.env.CONNECTION_URL;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("MongoDB database connected");
}).catch((error) => {
    console.log(error);
});
