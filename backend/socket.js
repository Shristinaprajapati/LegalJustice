// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   // Listen for the event from the client (when "Send Form" is clicked)
//   socket.on('sendFormNotification', (notificationData) => {
//     // Send a notification to the client
//     socket.emit('receiveNotification', notificationData);
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// // Start server
// server.listen(8080, () => {
//   console.log('Server running on port 8080');
// });
