import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import path from "path";
import connectDB from "./utils/db.js";
import userRoute from "./routers/user.router.js";
import companyRoute from "./routers/company.router.js";
import jobRoute from "./routers/job.router.js";
import applicationRoute from "./routers/application.router.js"

dotenv.config()

const app = express();

let port = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions))

// FIX: serve uploaded resumes/logos statically so the paths saved by
// multer (/uploads/<filename>) are actually reachable from the frontend.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API's

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.listen(port, () => {
    connectDB();
    console.log(`Listening port ${port}`);
})
