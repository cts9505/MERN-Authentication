import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";

const app=express();

app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(express.json());

connectDB();
const PORT =process.env.PORT;

app.get("/",(req,res)=>{res.send("API Working")});
app.use("/api",router);

app.listen(PORT,()=>{console.log("Server stated at port "+PORT)})
