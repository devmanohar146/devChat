const http  = require('http')
const {Server}  = require("socket.io")
const dotenv = require("dotenv")
const socketHandler = require("./sockets/socket")
dotenv.config();

const connectDB = require("../src/config/db")
connectDB()
const app = require("./app");
// const { log } = require('console');
const server = http.createServer(app)

const io  = new Server(server,{
    cors:{
        origin:"*"
    }
})

app.set("io",io)

//socket io connection
socketHandler(io)


const PORT = process.env.PORT  || 5000 ;
server.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})

