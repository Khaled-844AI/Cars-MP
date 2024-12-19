'use client';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useSearchParams } from 'next/navigation';
import { GetUser } from '../../lib/User';
import { fetchUserCars } from '../../lib/actions';
import CarCard from '../../components/CarCard';
import Loader from './../../components/Loader2'
import { Button } from '../../components/ui/button';
import Link from 'next/link';

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const [fetched, setFetched] = useState(false);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [userCars, setUserCars] = useState([]);
  const [loading, setLoading] = useState(true); 
  const userId = searchParams.get('userId');

  useEffect(() => {
    const FetchUserData = async (userId) => {
      try {
        const { User } = await GetUser(userId);
        setFetchedUser(User);
        const { Cars } = await fetchUserCars(User?.emailAddresses[0]?.emailAddress);
        setUserCars(Cars || []);
        setFetched(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); 
      }
    };

    if (!fetched && userId) {
      FetchUserData(userId);
    }
  }, [fetched, userId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <Loader/>
        </div>
      </>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* Background Image Section */}
      <div
        className="relative bg-cover bg-center min-h-[600px]"
        style={{
          backgroundImage:
            "url('https://worldwildschooling.com/wp-content/uploads/2024/01/Matterhorn_Mumemories_Adobe-Stock-Photo_682931585-1536x864.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Profile Section */}
      <div className="mx-auto p-6 bg-white shadow-lg rounded-lg -mt-44 relative z-10">
        <div className="ml-20">
          <div className="flex items-center space-x-4">
            <img
              src={fetchedUser?.imageUrl || '/default-profile.png'}
              alt="Profile"
              className="w-40 h-40 rounded-full border-2 border-white shadow-md -mt-20"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{fetchedUser?.username || 'Unknown User'}</h1>
              <p className="text-xl text-gray-500">
                {fetchedUser?.emailAddresses?.[0]?.emailAddress || 'No email available'}
              </p>
              <p className="text-xl text-gray-500">
                Since {fetchedUser?.createdAt ? new Date(fetchedUser.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mt-8 max-w-7xl mx-auto p-6">
          <h2 className="max-w-[50rem] sm:max-w-[49rem] mb-10 px-3 md:px-0 sm:text-5xl md:text-7xl text-4xl font-bold font-display md:leading-[1.1em] bg-gradient-to-b from-gray-800 to-gray-300 text-transparent bg-clip-text text-start">Available Cars</h2>

          {!fetchedUser?.publicMetadata?.isBuyer &&
                    !fetchedUser?.publicMetadata?.isDealer &&
                    <Link href={'/role'}>
                       <Button className='bg-gray-300 text-black'>Role <span className="bg-red-500 w-2 h-2 rounded-full inline-block animate-pulse"></span>
                       </Button>
                    </Link>
          }


          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-4">
            {userCars.length > 0 ? (
              userCars.map((car, index) => <CarCard car={car} key={index} />)
            ) : (
              <p className="col-span-full text-center text-gray-500">No cars available</p>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
