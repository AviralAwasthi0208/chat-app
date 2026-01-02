# ✨ Full-Stack Real-Time Chat & Video Calling App

A production-ready real-time communication platform featuring instant messaging, online presence tracking, and peer-to-peer audio/video calling. Built using the **MERN stack**, **Socket.IO**, and **WebRTC**.


### Key Features

* **🔐 Secure Authentication:** JWT-based auth with secure HTTP-only cookies.
* **💬 Real-Time Messaging:** Instant updates powered by Socket.IO (no polling).
* **📞 1-to-1 Audio/Video Calls:** Peer-to-peer streaming via WebRTC with ICE candidate handling.
* **🟢 Online Presence:** Real-time user status (online/offline) updates.
* **🧠 Global State:** Managed efficiently using **Zustand**.
* **🎨 Modern UI:** Built with **Tailwind CSS** and **DaisyUI**.
* **🚀 Single-Service Deployment:** React is built and served via the Express backend.
* **☁️ Render Ready:** Optimized for free-tier deployment on Render.

---

## 🧩 Architecture



### Socket.IO
* Handles real-time chat events (sending/receiving messages).
* Manages user presence (connection/disconnection events).
* Acts as the signaling server for WebRTC (exchanging offers, answers, and ICE candidates).

### WebRTC

* Enables peer-to-peer audio and video streaming.
* Uses STUN/TURN servers for NAT traversal.
* Ensures secure media exchange over HTTPS.

### Express Backend
* Serves REST APIs under `/api`.
* Serves the static React production build.
* Combines HTTP and WebSocket servers on a single port.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS + DaisyUI
* Zustand (State Management)
* Socket.IO Client

**Backend:**
* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO Server
* JWT (JSON Web Tokens)

---

## 📂 Project Structure

```bash
realtime-chat-app/
├── backend/
│   ├── controllers/      # Auth, message, user controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # REST API routes
│   ├── socket/           # Socket.IO & WebRTC signaling logic
│   ├── utils/            # Helpers (JWT, error handling)
│   └── server.js         # Entry point (Express + Socket.IO)
└── frontend/
    ├── src/
    │   ├── components/   # Chat, Call, UI components
    │   ├── store/        # Zustand global store
    │   ├── pages/        # Auth, Chat pages
    │   ├── utils/        # API helpers
    │   └── main.jsx      # React entry
    └── index.html
```
Environment Setup
Create a .env file in the backend directory with the following configuration:
```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Media Storage (Optional if used)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WebRTC (TURN Server Credentials)
VITE_XIRSYS_USERNAME=your_turn_username
VITE_XIRSYS_CREDENTIAL=your_turn_password  

```

nstallation & Running
1. Build the Application
Run the build script from the root directory. This installs dependencies for both frontend and backend, and builds the React app using Vite.
```
Bash

npm run build

```
2. Start the Server
Start the backend server, which will also serve the frontend build.
```

Bash

npm start
```
The application will be available at: http://localhost:5001

🌐 Production Deployment
This project is configured for Single-Origin Deployment.

Build: The React frontend is compiled into static files.

Serve: Express serves these static files (frontend/dist) for any non-API request.

Benefits:

Shared domain and port.

No CORS issues.

Supports Secure Cookies (SameSite).

Render Free Tier Compatible.

📌 Future Improvements
1.Group audio/video calls

2.Message read receipts (double checks)

3.File previews & downloads

4.Push notifications

5.Chat search functionality & Message reactions

⭐ Support
If you find this project helpful, please consider giving it a Star! ⭐