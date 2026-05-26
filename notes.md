src/
 ├── components
 ├── pages
 ├── hooks
 ├── context
 ├── services
 ├── sockets
 ├── utils
 └── layouts

--------------------------------
| Sidebar | Chat Header       |
|          |------------------|
| Chats    | Messages         |
| Users    |                  |
| Groups   |                  |
|          |------------------|
|          | Message Input    |
--------------------------------

Built a full-stack real-time team communication platform using React, Node.js, MongoDB, and Socket.IO supporting instant messaging, group chats, JWT authentication, online presence tracking, and scalable WebSocket-based communication.

### JavaScript

    import { GoogleGenAI } from "@google/genai";

    const ai = new GoogleGenAI({});

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Explain how AI works in a few words",
      });
      console.log(response.text);
    }

    await main();



schema relationships
chat architecture
socket event flow
real-time messaging
message persistence

POST   /api/chat
GET    /api/chat
POST   /api/message
GET    /api/message/:chatId


User A
   ↓
Socket Emit
   ↓
Server
   ↓
Store in MongoDB
   ↓
Broadcast Message
   ↓
User B receives instantly

tables - collectiom
row - document
column -field


a database has can have many collection(tables) 
collection contains rows(doucment) and column ()

| MongoDB Driver   | Mongoose           |
| ---------------- | ------------------ |
| Low-level        | Higher-level       |
| More control     | Easier development |
| No schema        | Schema support     |
| Less abstraction | More abstraction   |



io vs socket
io

Represents:

entire socket server

Used for:

broadcasting
global events
socket

Represents:

ONE connected client

Each user gets unique socket


socket.to(room).emit()

Sends event:

to everyone EXCEPT sender