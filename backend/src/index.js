import express from "express";
import "dotenv/config"
import dotenv from 'dotenv';
import authRoute from "./route/authRoutes.js";
import bookRoute from "./route/bookRoute.js"
import { connectDB } from "./lib/db.js"
import cors from "cors";
import job from "./lib/cron.js";


const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

job.start();
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/api/auth",authRoute)
app.use("/api/book",bookRoute)
app.use(cors());


app.listen(PORT,()=>{
    console.log(`server is runnig on port ${PORT}`);
    connectDB();
    
});
