import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import path from "path"

import { connectDB } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {app,server} from "./lib/socket.js"

dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve();

//Custom NoSQL Injection Sanitizer
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (const key in obj) {
      if (/^\$/.test(key) || /\./.test(key)) {
        delete obj[key]; // Removing keys starting with $ or containing .
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]); // Recursively sanitize
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Only catching frontend routes that don't start with "/api"
  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      res.status(404).send("API route not found");
    } else {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    }
  });
}


server.listen(PORT,() => {
    console.log("Server is running on port:"+ PORT);
    connectDB()
})