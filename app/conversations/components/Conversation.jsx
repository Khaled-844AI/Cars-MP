import React, { useState, useEffect, useRef } from "react";
import { api } from "../../../convex/_generated/api";
import { useMutationState } from "../../../hooks/useMutationState";

function Conversation({ conversationId, user, messages: initialMessages, destinatedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages || []);
  const { mutate: sendMessage, pending } = useMutationState(api.messages.createMessage);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    if(!pending)
      setMessages(initialMessages || []);
  }, [initialMessages.length]);

  const handleSendMessage = async () => {
    if (message.length > 0) {
      const newMessage = {
        conversationId,
        senderId: user?.id,
        sentAt: Date.now(),
        text: message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("")

      try {
        await sendMessage({
          conversationId,
          senderId: user?.id,
          text: message,
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        initialMessages.pop(newMessage);
      }
    }
  };

  return (
    <section className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 flex border-b bg-white border-gray-500 items-center">
        {conversationId && (
          <img
            className="w-10 h-10 rounded-full object-cover mr-3"
            src={destinatedUser?.imageUrl}
            alt={`${destinatedUser?.username}'s profile`}
          />
        )}
        <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{destinatedUser?.username}</h3>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <div className="space-y-4">
          {messages?.map((msg, key) => {
            // Format the timestamp
            const formattedDate = new Date(msg?.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={key}
                className={`flex ${
                  msg?.senderId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    msg?.senderId === user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-blue-600"
                  } rounded-xl p-2 max-w-xs`}
                >
                  <div className="flex flex-col">
                    <p className="break-words whitespace-normal">{msg?.text}</p>
                    <span
                      className={`text-[10px]  ${
                        msg?.senderId === user?.id ? "self-start text-gray-900" : "self-end text-gray-400"
                      }`}
                    >
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Empty div to act as the scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4">
        <div className="flex items-center">
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={pending}
          >
            {pending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Conversation;