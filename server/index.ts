import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Mock Database Connection
// mongoose.connect(process.env.MONGODB_URI!)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log('MongoDB Connection Error:', err));

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { username } = req.body;
  const user = { id: Math.random().toString(36).substr(2, 9), username };
  const token = jwt.sign(user, process.env.JWT_SECRET || 'secret');
  res.json({ token, user });
});

// Socket.io Logic
const onlineUsers = new Map<string, string>(); // userId -> socketId

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    onlineUsers.set(userId, socket.id);
    io.emit('user_status', { userIds: Array.from(onlineUsers.keys()) });
  }

  socket.on('send_message', ({ chatId, content, type, senderId }) => {
    const message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      content,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Broadcast to the chat room
    io.emit('new_message', { chatId, message });
  });

  socket.on('typing', ({ chatId, username, isTyping }) => {
    socket.broadcast.emit('typing_status', { chatId, username, isTyping });
  });

  socket.on('disconnect', () => {
    if (userId) {
      onlineUsers.delete(userId);
      io.emit('user_status', { userIds: Array.from(onlineUsers.keys()) });
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});