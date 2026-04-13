# Plan: Telegram-like Messaging Application

## 1. High-Level Architecture
- **Frontend**: React (Vite) + Tailwind CSS + shadcn/ui + Framer Motion.
- **Backend**: Node.js (Express) + Socket.io + MongoDB (Mongoose).
- **Authentication**: JWT-based auth (Signup/Login).
- **Real-time**: Socket.io for messaging, typing indicators, and online status.
- **Storage**: Cloudinary or local uploads for media/files.

## 2. Directory Structure
```text
/
├── server/               # Node.js backend
│   ├── src/
│   │   ├── controllers/  # API logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── sockets/      # Socket.io logic
│   │   ├── middleware/   # Auth & error handling
│   │   └── index.ts      # Server entry point
│   ├── .env
│   └── package.json
├── src/                  # React frontend
│   ├── components/       # UI components (shadcn + custom)
│   │   ├── chat/         # Chat-specific components
│   │   ├── auth/         # Auth components
│   │   └── shared/       # Reusable components
│   ├── hooks/            # Custom hooks (useSocket, useAuth)
│   ├── store/            # State management (Zustand)
│   ├── services/         # API & Socket services
│   ├── lib/              # Utils (shadcn lib)
│   ├── App.tsx           # Main application logic
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## 3. Implementation Steps

### Phase 1: Foundation & Auth
1. **Backend Setup**:
   - Initialize Express server with Socket.io.
   - Connect to MongoDB.
   - Implement JWT Auth (Signup, Login, Profile).
2. **Frontend Foundation**:
   - Set up Layout and Routing (React Router).
   - Implement Auth Pages (Login/Signup) using shadcn/ui forms.
   - Create Auth state management (Zustand).

### Phase 2: Core Messaging (One-to-One)
1. **Socket Integration**:
   - Connect frontend to backend via Socket.io.
   - Handle online/offline status.
2. **Chat UI**:
   - Create Sidebar (User list/Search).
   - Create Chat Window (Message list, Input area).
3. **Real-time Flow**:
   - Sending and receiving messages.
   - Storing messages in MongoDB.
   - Fetching message history.

### Phase 3: Group Chats & Statuses
1. **Group Logic**:
   - Backend: Group creation, members management.
   - Frontend: Group creation modal, group chat view.
2. **Message Status**:
   - Sent, Delivered, Seen markers.
   - Typing indicators (real-time events).

### Phase 4: Media & Advanced Features
1. **Media Sharing**:
   - Implement file/image upload (simulated or real).
2. **Reactions & Editing**:
   - Message reactions (popover menu).
   - Edit/Delete message functionality.
3. **Channels**:
   - Special group type where only admins post.

### Phase 5: Polishing & Responsive Design
- Add Framer Motion animations (message entry, sidebar transitions).
- Ensure full mobile responsiveness.
- Add notifications (sonner).
- Finalize Dark/Light mode.

## 4. Technical Constraints
- Use React 19 features.
- Strict TypeScript types.
- Tailwind CSS for all styling.
- Lucide icons for UI.
- Socket.io for real-time.
