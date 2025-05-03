import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Types for our chat system
interface User {
  userId: string;
  username: string;
  imageUrl: string;
  socketId: string;
}

interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer: HTTPServer = createServer(handle);
  const io = new Server(httpServer);

  // Store active users and conversations
  const activeUsers = new Map<string, User>();
  const conversations = new Map<string, Message[]>();

  io.on("connection", (socket: Socket) => {
    console.log("User connected ZZZ :", socket.id);

    // Handle user connection
    socket.on("user_connect", (userData: Omit<User, 'socketId'>) => {

        const user: User = {
          ...userData,  
          socketId: socket.id
        };
        activeUsers.set(userData.userId, user);
        console.log(`User ${userData.username} connected`, {
          totalUsers: activeUsers.size,
          users: Array.from(activeUsers.values()).map(u => u.username)
        });
        broadcastActiveUsers();
      });

    // Handle joining a conversation
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
      
      // Send conversation history if it exists
      if (conversations.has(conversationId)) {
        socket.emit("conversation_history", {
          conversationId,
          messages: conversations.get(conversationId)
        });
      }
    });

    // Handle new messages
    socket.on("new_message", (data: {
      conversationId: string;
      text: string;
      senderId: string;
    }) => {
      const message: Message = {
        senderId: data.senderId,
        text: data.text,
        timestamp: Date.now()
      };

      // Store message
      if (!conversations.has(data.conversationId)) {
        conversations.set(data.conversationId, []);
      }
      conversations.get(data.conversationId)?.push(message);

      // Broadcast to conversation room
      io.to(data.conversationId).emit("message_received", message);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      // Remove from active users
      for (const [userId, user] of activeUsers.entries()) {
        if (user.socketId === socket.id) {
          activeUsers.delete(userId);
          break;
        }
      }
      broadcastActiveUsers();
    });

    // Helper function to broadcast active users
    const broadcastActiveUsers = () => {
      const usersList = Array.from(activeUsers.values()).map(user => ({
        userId: user.userId,
        username: user.username,
        imageUrl: user.imageUrl,
        status: 'Online'
      }));
      io.emit("active_users", usersList);
    };
  });

  httpServer.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});