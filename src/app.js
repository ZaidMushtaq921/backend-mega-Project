import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express(); // IT WILL CREATE AN EXPRESS APPLICATION
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // IT IS USED TO ALLOW REQUEST FROM FRONTEND
    credentials: true, // IT WILL ALLOW COOKIES TO BE SENT / RECEIVED
  })
);
app.use(cookieParser()); // IT WILL ALLOW US TO USE COOKIES IN OUR APPLICATION
app.use(express.json({ limit: "16kb" })); // IT WILL ALLOW US TO PARSE JSON BODY REQUESTS (LIMIT IS USED TO LIMIT THE SIZE OF THE REQUEST BODY)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // IT WILL ALLOW US TO PARSE URL-ENCODED BODY REQUESTS (LIMIT IS USED TO LIMIT THE SIZE OF THE REQUEST BODY)
app.use(express.static("public")); //IT WILL ALLOW US TO SERVE STATIC FILES FROM THE PUBLIC DIRECTORY (EX: STYLESHEETS, IMAGES, ETC)



// Router 
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);
export default app;
