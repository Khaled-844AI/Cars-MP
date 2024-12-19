'use client'

import React from 'react'
import { useState }  from 'react';
import { FaTrash } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import ReplyForm from './ReplyForm';

function Sender({ message, profile, HandleRemoveMessage , sender, HandleReplied}) {
  const [reply, setReply] = useState(false);


  return (
    <>
    {!reply ? <div className="flex flex-col w-full h-full bg-white shadow-lg rounded-lg p-4 md:p-6">

      <div className='flex justify-end'>
        <FaReply className='me-10 cursor-pointer text-gray-600 hover:text-gray-800' onClick={() => setReply(true)} />
        <FaTrash onClick={() => HandleRemoveMessage(message)} className='text-red-600 cursor-pointer hover:text-red-800' />
      </div>
      

      <div className="flex flex-col md:flex-row items-center border-b pb-4 mb-4">
        <div className="w-16 h-16 mr-4">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full"></div>
          )}
        </div>
        
        <div className="flex flex-col text-center md:text-left">
          <span className="text-lg font-bold">{message.sender}</span>
          <span className="text-sm text-gray-500">{message.subject || 'No Subject'}</span>
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 overflow-y-auto text-gray-700 border rounded-lg p-4 md:p-6 text-sm md:text-base">
        {message.message
          ? message.message.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))
          : 'No content available'}
      </div>
    </div> : <ReplyForm profile={profile} message={message} sender={sender} HandleReplied={HandleReplied}/>}
    </>
  );
}

export default Sender;
