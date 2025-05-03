'use client'

import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import { BsFillChatRightFill } from "react-icons/bs";
import { useUser } from '@clerk/nextjs';
import Conversation from './components/Conversation';
import { socket } from '@/lib/socketClient';

function Conversations() {
  const { user, isLoaded } = useUser();
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (socket.connected) {
      setLoading(false);
      // Re-emit user_connect if we're already connected
      if (user) {
        socket.emit('user_connect', {
          userId: user.id,
          username: user.username,
          imageUrl: user.imageUrl
        });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    if (!socket.connected) {
      socket.auth = { userId: user.id };
      socket.connect();
    }

    const handleConnect = () => {
      console.log('Connected to socket');
      setLoading(false);
      setError(null);
      socket.emit('user_connect', {
        userId: user.id,
        username: user.username,
        imageUrl: user.imageUrl
      });
    };

    const handleActiveUsers = (users) => {
      setActiveUsers(users.filter(u => u.userId !== user.id));
    };

    const handleConnectError = (err) => {
      console.error('Connection error:', err);
      setLoading(false);
      setError('Failed to connect to chat server');
    };

    const handleDisconnect = (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        setError('Disconnected from server - trying to reconnect...');
      }
    };

    // Set up event listeners
    socket.on('connect', handleConnect);
    socket.on('active_users', handleActiveUsers);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      // Clean up listeners
      socket.off('connect', handleConnect);
      socket.off('active_users', handleActiveUsers);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [user, isLoaded]);

  const handleSelectConversation = (otherUserId) => {
    const conversationId = [user.id, otherUserId].sort().join('_');
    const otherUser = activeUsers.find(u => u.userId === otherUserId);
    
    setSelectedConversation({
      conversationId,
      messages: [],
      otherUser
    });
    
    socket.emit('join_conversation', conversationId);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-300">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-300">
        <Header />
        <div className="flex items-center justify-center flex-grow">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <aside className="w-1/4 overflow-y-auto no-scrollbar rounded-r-2xl border-gray-400 bg-gray-800">
          <div className="flex flex-row items-center p-4">
            <BsFillChatRightFill className="text-white text-2xl mr-2" />
            <h2 className="text-lg text-white font-semibold">Conversations</h2>
          </div>
          
          {activeUsers.length === 0 ? (
            <div className="p-4 text-white text-center">
              No other users online
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activeUsers.map((user) => (
                <li 
                  key={user.userId}
                  className={`p-4 cursor-pointer hover:bg-blue-900 ${
                    selectedConversation?.otherUser?.userId === user.userId 
                      ? 'bg-blue-900' 
                      : ''
                  }`}
                  onClick={() => handleSelectConversation(user.userId)}
                >
                  <div className='flex items-center'>
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={user.imageUrl}
                      alt={`${user.username}'s profile`}
                    />
                    <div className='ml-3'>
                      <p className="text-sm font-medium text-white">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-300">Online</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="flex-grow bg-white">
          {selectedConversation ? (
            <Conversation 
              conversationId={selectedConversation.conversationId}
              user={user}
              messages={selectedConversation.messages}
              destinatedUser={selectedConversation.otherUser}
              socketRef={socket}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-600">
                  {activeUsers.length === 0 
                    ? "No other users are currently online" 
                    : "Choose a user to start chatting"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Conversations;