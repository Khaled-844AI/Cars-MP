'use client'

import React, { Suspense, useEffect, useState } from 'react';
import Header from "../../../components/Header";
import { BsFillChatRightFill } from "react-icons/bs";
import { useUser } from '@clerk/nextjs';
import { useMutationState } from '../../../hooks/useMutationState';
import { api } from "../../../convex/_generated/api";
import { GetUser } from '../../../lib/User';
import Conversation from '../components/Conversation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

function Conversations() {

  const {user} = useUser();
  const [convUsers , setConvUsers] = useState(null);
  const [selectedConversation , setSelectedConversation] = useState(null);
  const {mutate: getConversations} = useMutationState(
    api.conversations.getConversations
  )
  const router = useRouter();

  const params = useSearchParams();
  const conversationId = params.get('id');
  const className = "p-4 cursor-pointer bg-blue-900";


  useEffect(() => {

    const fetchUserConversations = async (userId)=>{
      const users = [];
      const conversations = await getConversations({
        userId: userId,
      });

      for(const item of conversations){
            for(const participant of item.conversation.participants){
            if(participant !== userId){
                const user = await GetUser(participant);
                users.push({user : user, messages : item.messages, conversationId : item.conversation._id});
                if(conversationId === item.conversation._id){
                  setSelectedConversation({user : user, messages : item.messages, conversationId : item.conversation._id});
                }
              }
            }
        }
      setConvUsers(users);
    }

    if(user && conversationId){
      fetchUserConversations(user?.id);
    }

  }, [convUsers, user,conversationId]);

  console.log(selectedConversation);

  const HandleConversations = () =>{
    router.push("/conversations");
  }


  const HandleSelectConversation = (conversationId)=>{
    
    router.push(`/conversations/conversation?id=${conversationId}`);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-300">
      <Header />

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-1/4 overflow-y-auto no-scrollbar rounded-br-2xl border-gray-400 bg-gray-800">
          <div className="flex flex-row items-center p-4 mb-4">
            <BsFillChatRightFill className="text-white text-2xl mr-2" />
            <h2 onClick={HandleConversations} className="text-lg hover:cursor-pointer text-white font-semibold">Conversations</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {/* Dummy Conversation Items */}
            {convUsers?.map((conv , key) => (
              <li key={key}
               className= {conv?.user?.User?.id == selectedConversation?.user?.User?.id ? className : "p-4 cursor-pointer hover:bg-blue-900"}
               onClick={()=>HandleSelectConversation(conv?.conversationId)}>
                <div className='flex'>
                    <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={conv?.user?.User?.imageUrl}
                          alt={`${conv?.user?.User?.username}'s profile`}
                    />
                    <div className='ml-2'>
                      <p className="text-sm font-medium text-white ml-2">{conv?.user?.User?.username}</p>
                      <p className="text-xs text-white truncate">{(conv?.messages[conv?.messages?.length-1]?.text || "").slice(0, 10).concat("...")}</p>
                    </div>
                </div>
                
              </li>
            ))}
          </ul>
        </aside>
        {/* Chat Panel */}
        {selectedConversation && user && 
        <Conversation 
        conversationId={selectedConversation?.conversationId}
        user={user}
        messages={selectedConversation?.messages}
        destinatedUser={selectedConversation?.user?.User}/>}
      </div>
    </div>
  );
}

export default function conversations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Conversations />
    </Suspense>
  );
}
