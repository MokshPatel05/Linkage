import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postsRoutes from './routes/posts.routes.js';
import usersRoutes from './routes/users.routes.js';
dotenv.config()
//initialize app
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

//all routes
app.use(postsRoutes);
app.use(usersRoutes);


//environment variables
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

//connect to MongoDB
const Connect = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB 🎉");
    } catch (error) {
        console.log("MongoDB connection error 💔", error);
    }
}
Connect();

//server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT + " 🚀");
})
