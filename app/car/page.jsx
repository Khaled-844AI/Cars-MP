'use client'

import { React, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import { useUser } from '@clerk/nextjs';
import { Separator } from "../../components/ui/separator"
import { FaCheck } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Loader from './../../components/Loader'
import {fetchCarData , fetchCarMessages, fetchFavoriteCar, AddtoFavorite} from '../../lib/actions'
import { api } from "@/convex/_generated/api";
import { useMutationState } from '@/hooks/useMutationState';


function CarDetails() {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sent , setSent] = useState(false);
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');
  const [message , setMessage] = useState("");
  const [messageExists , setMessageExists] = useState(false);
  const [isFavorite , setIsFavorite] = useState(false);
  const [carOwner , setCarOwner] = useState(null);
  const {user} = useUser();
  const router = useRouter();
  const { mutate: createConversation , pending }= useMutationState(
    api.conversations.createConversation
  );




  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCarDetails = async () => {
      if(user === undefined) return ;
      try {
        
        const {CarData } = await fetchCarData(carId);

        if(CarData) setCar(CarData);
        
        const { MessageData } = await fetchCarMessages(carId , user?.emailAddresses[0]?.emailAddress);
        console.log(MessageData)

        if(MessageData && MessageData[0]){
          setMessage(MessageData[0].message)
          setMessageExists(true)
        }
        
        const { FavoriteData } = await fetchFavoriteCar(carId , user?.emailAddresses[0]?.emailAddress);

        if(FavoriteData && FavoriteData[0]){
          setIsFavorite(true)
        }

        const response = await fetch('/api/fetchUsers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senderEmail: CarData?.user }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const carOwner = await response.json(); 

        if(response.ok){
          setCarOwner(carOwner);
        }  

      }catch(error){
        console.error("Error fetching if Car is Favorite :",error)
      }finally{
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId , user]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex flex-col mt-[20%] items-center justify-center text-center">
              <Loader className="text-black" />
        </div>
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl font-semibold text-gray-600">Car not found</div>
        </div>
      </>
    );
  }

  const HandleAddFavorite = async (carId)=>{

    const {error , wasFavorite} = await AddtoFavorite(
      user?.emailAddresses[0]?.emailAddress,
      carId,
      isFavorite);

    if(wasFavorite && !error){
      setIsFavorite(false);
    }else if(!wasFavorite && !error){
      setIsFavorite(true);
    }  
    if(error){
      console.error(error);
    }
  }




  const HandleStartConversation = async () => {
    
    try {
      const conversation = await createConversation({
        participants: [user?.id, carOwner?.id],
      });

      router.push(`/conversations/conversation?id=${conversation}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };


  return (
    <>
    <Header />
    
    <div className="max-w-9xl mx-auto p-6 mt-10 mb-10 bg-gray-100">
      
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        {car?.model}
        <div className="flex justify-end">
          <FaStar
            className={`ml-4 text-4xl hover:cursor-pointer ${isFavorite ? "text-yellow-500" : "text-gray-400"}`}
            onClick={() => HandleAddFavorite(car.id)}
          />
        </div>

      </h1>
      
      <div className="w-full max-w-7xl mx-auto">

        
  
        <div className="bg-gray-200 rounded-lg shadow-lg p-8 mt-10 border border-gray-300 w-full">
        {/*user */}
        <div className="flex items-center mb-10">
              <a href={'/profile?userId='+carOwner?.id}>
                  <img
                    className="w-16 h-16 rounded-full object-cover hover:cursor-pointer"
                    src={carOwner?.imageUrl}
                    alt={`${user.username}'s profile`}
                  />
              </a>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{carOwner?.username || 'Anonymous'}</h2>
                {carOwner?.emailAddresses[0]?.emailAddress &&
                <p className="text-sm text-gray-600">{carOwner?.emailAddresses[0]?.emailAddress}</p>}
              </div>
        </div>

        {/*Car Details */}            
        <div className="w-full mb-10">
          <div className="grid grid-cols-2 gap-6">
            {car.CarImages.map((image, index) => (
              <div
                key={index}
                className="w-full h-90 border border-gray-300 rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={image.imageUrl}
                  alt={`Car Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>


          <div className="flex justify-center">
            <h3 className="text-3xl font-semibold text-gray-700 mb-7">
              Car Details
            </h3>
          </div>

          <Separator className='bg-gray-400 mb-10'/>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <span className="font-semibold text-gray-700 grid grid-cols-1">
                Price:{' '}
              </span>
              <span className="text-green-500">
                <span className="text-green-600">$</span>
                {car.price}
              </span>
            </div>
            <div className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <span className="font-semibold text-gray-700 grid grid-cols-1">
                Condition:{' '}
              </span>
              <span className="text-blue-400">{car.condition}</span>
            </div>
            <div className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <span className="font-semibold text-gray-700 grid grid-cols-1">
                Gear Type:{' '}
              </span>
              <span className="text-gray-600">{car.gear_type}</span>
            </div>
            <div className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <span className="font-semibold text-gray-700 grid grid-cols-1">
                Fuel Type:{' '}
              </span>
              <span className="text-gray-600">{car.fuel_type}</span>
            </div>
            <div className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <span className="font-semibold text-gray-700 grid grid-cols-1">
                Year:{' '}
              </span>
              <span className="text-gray-600">{car.year}</span>
            </div>
            <div className="text-lg mb-6 border rounded-lg p-4 shadow-lg">
              <span className="font-semibold text-gray-700 grid grid-cols-1">
                Mileage:{' '}
              </span>
              <span className="text-gray-600">{car.mileage}km</span>
            </div>
          </div>
  
          <div className="text-lg mt-6 rounded-lg p-4">
            <span className="font-semibold text-gray-700">Description: </span>
            <p className="text-gray-600 mt-2">{car.description}</p>
          </div>

          <div className="text-lg mt-6 rounded-lg p-4">
            <span className="font-semibold text-gray-700">Features: </span>
            <div className='mt-5'>
              {car.features && car.features.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <FaCheck className="text-green-500" />
                    <p className="text-gray-600 ml-2 mt-1">{feature}</p>
                  </div>
                ))}
              </div>
              
              ) : (
                <p className="text-gray-600 mt-2">No features available</p>
              )}
            </div>

            </div>
                {carOwner.id !== user.id && <div className='flex justify-center mt-10'>
      
                    <button
                      onClick={HandleStartConversation}
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Start Converstion
                    </button>

                </div>}    
            </div>
      </div>
    </div>
  </>
  
  );
}

export default CarDetails;
