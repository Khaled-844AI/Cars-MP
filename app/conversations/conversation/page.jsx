'use client'

import React, { Suspense, useEffect, useState, useRef } from 'react';
import Header from "../../../components/Header";
import { BsFillChatRightFill } from "react-icons/bs";
import { useUser } from '@clerk/nextjs';
import Conversation from '../components/Conversation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { socket } from '@/lib/socketClient';

function Conversations() {
  const { user } = useUser();
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const socketRef = useRef(null);
  const router = useRouter();
  const params = useSearchParams();
  const conversationId = params.get('id');
  const className = "p-4 cursor-pointer bg-blue-900";

  useEffect(() => {
    if (!user) return;

    // Handle user connection
    socket.emit('user_connect', {
      userId: user.id,
      username: user.username,
      imageUrl: user.imageUrl
    });

    // Listen for active users updates
    socket.on('active_users', (usersList) => {
      // Filter out the current user from the active users list
      const otherUsers = usersList.filter(u => u.userId !== user.id);
      setActiveUsers(otherUsers);
    });

    // Listen for new messages
    socket.on('message_received', (message) => {
      setSelectedConversation(prev => {
        if (!prev) return null;
        
        // Check if the message belongs to the current conversation
        const otherUserId = prev.conversationId.split('_').find(id => id !== user.id);
        if (message.senderId === otherUserId || message.senderId === user.id) {
          return {
            ...prev,
            messages: [...prev.messages, message]
          };
        }
        return prev;
      });
    });

    // Listen for conversation history
    socket.on('conversation_history', (data) => {
      if (data.conversationId === conversationId) {
        const otherUserId = data.conversationId.split('_').find(id => id !== user.id);
        const otherUser = activeUsers.find(u => u.userId === otherUserId);
        
        setSelectedConversation({
          conversationId: data.conversationId,
          messages: data.messages,
          user: { 
            User: otherUser
          }
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (conversationId && socket?.connected) {
      // Join the conversation room
      socket.emit('join_conversation', conversationId);
      
      // Find the other user in the conversation
      const otherUserId = conversationId.split('_').find(id => id !== user?.id);
      const otherUser = activeUsers.find(u => u.userId === otherUserId);
      
      setSelectedConversation(prev => ({
        conversationId,
        messages: prev?.conversationId === conversationId ? prev.messages : [],
        user: { 
          User: otherUser
        }
      }));
    }
  }, [conversationId, activeUsers]);

  const startNewConversation = (otherUserId) => {
    const newConversationId = [user?.id, otherUserId].sort().join('_');
    const otherUser = activeUsers.find(u => u.userId === otherUserId);
    
    setSelectedConversation({
      conversationId: newConversationId,
      messages: [],
      user: { 
        User: otherUser
      }
    });
    return newConversationId;
  };

  const HandleSelectConversation = (otherUserId) => {
    const newConversationId = startNewConversation(otherUserId);
    router.push(`/conversations/conversation?id=${newConversationId}`);
  };

  const HandleConversations = () => {
    router.push("/conversations");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <Header />

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-1/4 overflow-y-auto no-scrollbar rounded-br-2xl border-gray-400 bg-gray-800">
          <div className="flex flex-row items-center p-4 mb-4">
            <BsFillChatRightFill className="text-white text-2xl mr-2" />
            <h2 onClick={HandleConversations} className="text-lg hover:cursor-pointer text-white font-semibold">
              Conversations
            </h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {activeUsers.map((activeUser) => (
              <li 
                key={activeUser.userId}
                className={
                  selectedConversation?.conversationId?.includes(activeUser.userId) 
                    ? className 
                    : "p-4 cursor-pointer hover:bg-blue-900"
                }
                onClick={() => HandleSelectConversation(activeUser.userId)}
              >
                <div className='flex'>
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={activeUser.imageUrl}
                    alt={`${activeUser.username}'s profile`}
                  />
                  <div className='ml-2'>
                    <p className="text-sm font-medium text-white ml-2">
                      {activeUser.username}
                    </p>
                    <p className="text-xs text-white truncate">
                      {activeUser.status || 'Online'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        
        {/* Chat Panel */}
        {selectedConversation && user && 
          <Conversation 
            conversationId={selectedConversation.conversationId}
            user={user}
            messages={selectedConversation.messages}
            destinatedUser={selectedConversation.user?.User}
            socketRef={socket}
          />
        }
      </div>
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Conversations />
    </Suspense>
  );
}