console.log("Jay Shri Ram")
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.CROS_ORIDIN
}));

app.use(express.json({limit: "25kb"}));
app.use(express.urlencoded({extends: true, limit: "25kb"}));
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.routes.js'

app.use("/api/v1/user", userRouter)

export default app;

// http://localhost:3000/api/v1/user/register