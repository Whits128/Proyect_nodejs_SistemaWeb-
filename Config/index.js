import app from '../Api/app';
import config from './config';
import { Server } from 'socket.io';
import http from 'http';

// Crear el servidor HTTP
const server = http.createServer(app);

// Crear instancia de Socket.IO y adjuntar al servidor HTTP
const io = new Server(server);

// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado a través de Socket.IO');
  // Puedes manejar otros eventos si es necesario
});

// Iniciar el servidor y el socket en puertos configurados
server.listen(config.port, () => {
  console.log('Servidor en puerto', config.port);
  
  io.listen(config.socketPort, () => {
    console.log('Servidor en socketPort', config.socketPort);
  });
});
