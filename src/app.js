import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// Middlewares
app.use(cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Networking Backend Running 🚀"
    })
})

export default app