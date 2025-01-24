const { Server: SocketIOServer } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let io;

function Socket_Maker(server) {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*", // Replace with your frontend URL
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.user = decoded.user;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log('CONNECTION SUCCESSFUL');

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user ? socket.user.id : 'unknown user');
        });
    });
    return io;
}
function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call Socket_Maker first.');
    }
    return io;
}
console.log('Exporting Socket_Maker:', Socket_Maker);
module.exports = { Socket_Maker, getIO };

