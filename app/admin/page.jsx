'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import HomeButton from '../../components/HomeButton';
import { FaRegChartBar } from 'react-icons/fa';
import { Button } from '../../components/ui/button';
import { RiSettingsFill } from 'react-icons/ri';
import { FaUsersCog } from 'react-icons/fa';
import Users from './components/Users';

function Page() {
  const [activeButton, setActiveButton] = useState(1);
  const [users, setUsers] = useState(null);

  const handleButtonClick = (id) => {
    setActiveButton(id);

    // Correct indexing issue
    const selectedButton = buttons.find((button) => button.id === id);
    setUsers(selectedButton ? selectedButton.content : null);
  };

  // Define buttons array with components and their IDs
  const buttons = [
    {
      id: 1,
      component: (
        <HomeButton
          key={1}
          id={1}
          isActive={activeButton === 1}
          onClick={() => handleButtonClick(1)}
        />
      ),
      content: null, // Add relevant content here if needed
    },
    {
      id: 2,
      component: (
        <Button
          key={2}
          id={2}
          onClick={() => handleButtonClick(2)}
          className={`w-[70%] sm:w-[90%] md:w-[70%] rounded-2xl h-[12%] flex flex-col items-center justify-center ${
            activeButton === 2
              ? 'bg-white text-black shadow-lg shadow-white hover:bg-white'
              : 'bg-black text-white hover:bg-gray-700 hover:text-black'
          }`}
        >
          <FaRegChartBar className={`${activeButton === 2 ? 'text-black animate-pulse' : ''}`} />
          <div className={`${activeButton === 2 ? 'animate-pulse' : ''}`}>Statistics</div>
        </Button>
      ),
      content: <div>Statistics Content</div>,
    },
    {
      id: 3,
      component: (
        <Button
          key={3}
          id={3}
          onClick={() => handleButtonClick(3)}
          className={`w-[70%] sm:w-[90%] md:w-[70%] rounded-2xl h-[12%] flex flex-col items-center justify-center ${
            activeButton === 3
              ? 'bg-white text-black shadow-lg shadow-white hover:bg-white'
              : 'bg-black text-white hover:bg-gray-700 hover:text-black'
          }`}
        >
          <FaUsersCog className={`${activeButton === 3 ? 'text-black animate-pulse' : ''}`} />
          <div className={`${activeButton === 3 ? 'animate-pulse' : ''}`}>Users</div>
        </Button>
      ),
      content: <Users />,
    },
    {
      id: 4,
      component: (
        <Button
          key={4}
          id={4}
          onClick={() => handleButtonClick(4)}
          className={`w-[70%] sm:w-[90%] md:w-[70%] rounded-2xl h-[12%] flex flex-col items-center justify-center ${
            activeButton === 4
              ? 'bg-white text-black shadow-lg shadow-white hover:bg-white'
              : 'bg-black text-white hover:bg-gray-700 hover:text-black'
          }`}
        >
          <RiSettingsFill className={`${activeButton === 4 ? 'text-black animate-pulse' : ''}`} />
          <div className={`${activeButton === 4 ? 'animate-pulse' : ''}`}>Settings</div>
        </Button>
      ),
      content: <div>Settings Content</div>,
    },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-white gap-10 mb-5">
        {/* Sidebar */}
        <div className="w-[15%] sm:w-[20%] md:w-[8%] h-[90vh] bg-black rounded-3xl flex flex-col items-center justify-evenly">
          {buttons.map(({ id, component }) => (
            <React.Fragment key={id}>{component}</React.Fragment>
          ))}
        </div>

        <div className="w-[80%] h-[90vh] bg-gray-200 rounded-3xl flex items-center justify-center">
          <div className="w-full h-full overflow-y-auto no-scrollbar p-6">
            {users}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Page;
