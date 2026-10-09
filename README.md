# 💬 message-canvas

A real-time, Telegram-style messaging app with one-to-one chats, group chats, and live status indicators.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

## Screenshots

[Add 2-3 screenshots: login, chat window, group chat]

## Features

Tick what's working in your build:

- [ ] JWT authentication (signup, login, profile)
- [ ] Real-time one-to-one messaging with Socket.io
- [ ] Online/offline status and typing indicators
- [ ] Message history stored in MongoDB
- [ ] Group chats
- [ ] Sent / delivered / seen markers
- [ ] Image and file sharing
- [ ] Message reactions, editing, and deletion
- [ ] Channels (admin-only posting)
- [ ] Light and dark mode, responsive layout, animations

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB (Mongoose) |
| Auth | JSON Web Tokens |

## Getting started

**Requirements:** Node.js, npm, and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/unmoha/message-canvas.git
cd message-canvas
```

**Backend**
```bash
cd server
npm install
cp .env.example .env    # then add your MongoDB URI and JWT secret
npm run dev
```

**Frontend** (in a new terminal, from the project root)
```bash
npm install
npm run dev
```

> ⚠️ Never commit your `.env` file or secrets.

## Project structure

```
message-canvas/
├── server/    # Node.js backend (API, Socket.io, MongoDB models)
├── src/       # React frontend
├── public/    # Static assets
└── plan.md    # Original project plan
```

## Roadmap

- [ ] [Next feature you plan to build]

## Author

**Anwar Mohammed** · [an8702299@gmail.com](mailto:an8702299@gmail.com) · [GitHub](https://github.com/unmoha)
