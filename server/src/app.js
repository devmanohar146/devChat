const express = require("express")
const cors  = require("cors")
const app = express()
const authRoutes = require("./routes/authRoutes")
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
        res.send("API is running ...")
})
app.use("/api/auth",authRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)


module.exports = app;