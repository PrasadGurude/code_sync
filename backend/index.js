const express = require(express())
const { Server } = require("socket.io");
const http = require('http');

const app = express();

const server = http.createServer(app);

const io = new Server(server);


server.listen(3000,()=>{
    console.log('server is up and running')
})

