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

// Like Routes
import likeRouter from "./routes/like.routes.js"
app.use("/api/v1/like", likeRouter)

// Comment Routes
import commentRouter from "./routes/comment.routes.js"
app.use("/api/v1/comment", commentRouter)

export {app}