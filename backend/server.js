require('dotenv').config();
const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');
const connection = require('./connectDb/connectMongo');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT;

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use(express.static(path.join(__dirname, '../frontend')));

connection();

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", 
    methods: ["GET", "POST"],
    credentials: true,
  }
});

io.on('connection' , (socket)=>{
    socket.on('join-room',({ roomId, peerId, username })=>{
        socket.join(roomId);
        console.log(`${username} connected`);
        socket.to(roomId).emit('user-connected',({ peerId }));
        socket.on('new-message',({ username, message })=>{
            io.to(roomId).emit('new-message',({ username, message }));
        })
        socket.on('disconnect', () => {
            console.log(`${username} disconnected`);
            socket.to(roomId).emit('user-disconnected', { peerId });
        });
    })
})

app.use('/api',require('./routes/roomRoutes'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

server.listen( port , () => {
    console.log(`server is listening throungh port ${port}`);
})