const http  = require('http')
const {Server}  = require("socket.io")
const dotenv = require("dotenv")

dotenv.config();

const connectDB = require("../src/config/db")
connectDB()
const app = require("./app");
const { log } = require('console');
const server = http.createServer(app)

const io  = new Server(server,{
    cors:{
        origin:"*"
    }
})

io.on("connection",(socket)=>{
    console.log("User Disconnect:",socket.id);
    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id)
    })
})

const PORT = process.env.PORT  || 5000 ;
server.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})

