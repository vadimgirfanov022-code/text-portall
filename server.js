//JAVASCRIPT

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
    console.log('Устросйство подключено: ${socket.id}');
    //вход  в комнату по коду 
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log('устройство вошло в комнату: ${roomId}');

    //сообщение остальным что кто-то подключился к комнате 
    socket.to(roomId).emit('peer-connection');
});

//моментальная пересылка текста (без сохранения на диск!)
socket.on('send-text', ({ roomId, text }) => {
    //оправляем только на другое устройство в этой комнате
    socket.to(roomId).emit('receive-text', text);
});

socket.on ('disconnect', () => {
    console.log('Устройство отключилось: ${socket.id}');
   });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('сервер запущен на порту ${PORT}`);
});        
