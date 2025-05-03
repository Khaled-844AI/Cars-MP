'use client'

import { useEffect, useState, useCallback } from 'react';


export default function Conversation({
  conversationId,
  user,
  messages: initialMessages = [],
  destinatedUser,
  socketRef
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Initialize messages and handle updates
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Handle incoming messages
  useEffect(() => {
    if (!socketRef) return;

    const handleNewMessage = (message) => {
      // Only add if it belongs to this conversation
      const isCurrentConversation = messages.some(msg => 
        msg.senderId === message.senderId && 
        msg.timestamp === message.timestamp
      );
      
      if (!isCurrentConversation) {
        setMessages(prev => [...prev, message]);
      }
    };

    socketRef.on('message_received', handleNewMessage);

    return () => {
      socketRef.off('message_received', handleNewMessage);
    };
  }, [socketRef, messages]);

  const sendMessage = useCallback(async () => {
    if (!messageInput.trim()) return;
    if (!socketRef?.connected) {
      socketRef?.connect();
    }

    setIsSending(true);
    setError(null);

    try {
      const messageObj = {
        conversationId,
        text: messageInput,
        senderId: user.id,
        timestamp: Date.now()
      };

      // Optimistic update
      setMessageInput('');

      // Send to server
      socketRef.emit('new_message', messageObj, (ack) => {
        if (!ack.success) {
          setError(ack.error || 'Failed to send message');
          // Revert optimistic update if failed
          setMessages(prev => prev.filter(msg => msg.timestamp !== messageObj.timestamp));
        }
      });
    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    } finally {
      setIsSending(false);
    }
  }, [messageInput, socketRef, conversationId, user.id]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Conversation Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={destinatedUser?.imageUrl}
            alt={`${destinatedUser?.username}'s profile`}
          />
          <div className="ml-3">
            <p className="text-lg font-semibold">{destinatedUser?.username}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={`${message.timestamp}-${index}`}
              className={`mb-4 flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`p-3 rounded-lg max-w-xs lg:max-w-md ${message.senderId === user.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white border border-gray-200'}`}
              >
                <p>{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isSending}
            className="flex-grow p-2 border rounded-l-lg focus:outline-none disabled:opacity-50"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            disabled={isSending || !messageInput.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}