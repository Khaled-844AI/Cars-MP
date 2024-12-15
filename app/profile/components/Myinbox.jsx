'use client'
import { useUser } from '@clerk/nextjs';
import {supabase} from './../../../lib/initSupabase';
import React from 'react';
import {useEffect, useState}  from 'react';
import Sender from './Sender';

function MyInbox() {
  const { user } = useUser(); 
  const [fetched, setFetched] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [profileOpened, setProfileOpened] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sendersProfiles, setSendersProfiles] = useState({});
  const [selectedProfile, setSelectedProfile] = useState([]);
  const [sentMessages , SetSentMessages] = useState([]);

  useEffect(() => {
    const fetchUserInbox = async () => {
      if (!fetched && user) {
        const { data, error } = await supabase
          .from('CarMessages')
          .select('*')
          .or('receiver.eq.'+user.emailAddresses[0]?.emailAddress) 
          .order('id', { ascending: false })

        if (error) {
          console.error('Error fetching inbox:', error);
        } else {
          setInbox(data);
        }
        setFetched(true);
      }
    };

    fetchUserInbox();
  }, [fetched, user]);

  useEffect(() => {
    const fetchSenderProfiles = async () => {
      const profiles = {};

      await Promise.all(
        inbox.map(async (sender) => {
          const profile = await fetchSenderProfile(sender.sender);
          if (profile) {
            profiles[sender.sender] = profile;
          }
        })
      );

      setSendersProfiles(profiles);
    };

    if (inbox?.length > 0) {
      fetchSenderProfiles();
    }
  }, [inbox]);

  const fetchSenderProfile = async (email) => {
    try {
      const response = await fetch('/api/fetchUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: email }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const userProfile = await response.json();
      return userProfile;
    } catch (error) {
      console.error('Error fetching sender profile:', error);
    }
  };

  const handleMessageOverview = (message) => {
    setProfileOpened(true);
    setSelectedMessage(message);
    const profile = Object.values(sendersProfiles).find(
      (profile) => profile?.emailAddresses[0]?.emailAddress === message.sender
    );
  
    setSelectedProfile(profile || []);
  };

  const HandleRemoveMessage = async (message)=>{

    const response = await supabase
    .from('CarMessages')
    .delete()
    .eq('id', message.id)

    console.log(response)

    setInbox(inbox.filter((PrevMessages)=>(PrevMessages.id !== message.id)))
    setProfileOpened(false)
  }

  const HandleReplied = ()=>{
    setProfileOpened(false)
  }

  const HandleSentMessages = async ()=>{
    const {data , error} = await supabase.from('CarMessages')
    .select('*')
    .eq('sender', user.emailAddresses[0]?.emailAddress)
    .order('id', { ascending: false })

    setInbox(data)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white border-r h-full p-4">
        <h3 className="font-bold text-lg mb-6">Folders</h3>
        <ul className="space-y-4 text-gray-700">
          <li className="cursor-pointer hover:text-blue-500 active" onClick={() => {setProfileOpened(false); setFetched(false)}}>Inbox</li>
          <li className="cursor-pointer hover:text-blue-500" onClick={() =>{ HandleSentMessages(); setProfileOpened(false)}}>Sent</li>
        </ul>
      </div>

      {!profileOpened ? (
        <div className="flex-1 flex flex-col">
          <div className="w-full h-full border-b bg-white overflow-y-auto">
            {fetched && inbox?.length > 0 ? (
              inbox.map((message) => (
                <div key={message.id} className="p-4 border-b hover:bg-gray-100 cursor-pointer">
                    <div onClick={() => handleMessageOverview(message)}>
                  <div
                    className="flex justify-between items-center"
                    
                  >
                    <div className="flex items-center">
                      <img
                        src={sendersProfiles[message.sender]?.imageUrl || '/default-avatar.png'}
                        alt="Sender Profile"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <h4 className="text-sm font-semibold">
                         {message.sender || 'No Subject'}
                      </h4>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-600 m-4">
                    {message?.message?.length > 50 
                      ? `${message.message.substring(0, 50)}...` 
                      : message.message || 'No content available'}
                  </p>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-600">No messages available</div>
            )}
          </div>
        </div>
      ) : <Sender message={selectedMessage}
        profile={selectedProfile}
        HandleRemoveMessage={HandleRemoveMessage}
        sender={user}
        HandleReplied={HandleReplied}
        /> }
    </div>
  );
}

export default MyInbox;
