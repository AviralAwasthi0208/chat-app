✨ Full-Stack Real-Time Chat & Video Calling App ✨

A production-ready real-time communication platform featuring instant messaging, online presence, and peer-to-peer audio/video calling, built with the MERN stack, Socket.IO, and WebRTC.

🚀 Features

🌟 Tech Stack: MongoDB, Express, React, Node.js (MERN)

🔐 Authentication & Authorization with JWT (secure HTTP-only cookies)

💬 Real-time messaging powered by Socket.IO (no HTTP polling)

📞 One-to-One Audio & Video Calling using WebRTC (STUN/TURN, ICE candidates)

🟢 Live online user presence and status updates

🧠 Global state management with Zustand

🎨 Modern, responsive UI using Tailwind CSS & DaisyUI

🐞 Robust error handling on both client and server

🚀 Production deployment as a single service (frontend served from backend)

⭐ Fully deployable for free on Render

🧩 Architecture Overview

Socket.IO

Real-time chat events

Online/offline presence

WebRTC signaling (offer, answer, ICE candidates)

WebRTC

Peer-to-peer audio/video streaming

NAT traversal using STUN/TURN servers

Express Backend

REST APIs under /api

Serves the React production build

Single-Origin Deployment

Frontend and backend run on the same domain and port

🔐 Environment Setup

Create a .env file in the backend directory:

MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VITE_XIRSYS_USERNAME=your_turn_username
VITE_XIRSYS_CREDENTIAL=your_turn_password
NODE_ENV=development


⚠️ In production, PORT and NODE_ENV are handled automatically by the hosting provider (e.g. Render).

🛠️ Build the Application

Installs dependencies for both frontend and backend, then builds the React app:

npm run build

▶️ Start the Application

Starts the backend server and serves the frontend build:

npm start


The application will be available at:

http://localhost:5001

🌐 Production Deployment

React app built using Vite and served via Express static files

REST APIs and Socket.IO run on the same origin

Supports secure cookies, WebSockets, and WebRTC over HTTPS

Successfully deployed on Render (Free Tier)

📌 Future Improvements

Group video calls

Message read receipts

File previews and downloads

Push notifications

⭐ Support

If you find this project helpful, consider giving it a ⭐
Feel free to fork, explore, and contribute!