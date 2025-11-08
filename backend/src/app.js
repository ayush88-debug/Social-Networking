import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app= express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({limit:"20kb", extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

// User Routes
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/user",userRouter)

// Post Routes
import postRouter from "./routes/post.routes.js"
app.use("/api/v1/post", postRouter)

// Friendship Routes
import friendshipRouter from "./routes/friendship.routes.js"
app.use("/api/v1/friendship", friendshipRouter)

export {app}