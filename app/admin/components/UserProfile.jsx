'use client'
import React, { useEffect, useState } from 'react';
import {fetchUserCars} from './../../../lib/actions'
import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import UserCar from './UserCar';
import Loader from './../../../components/Loader'
import { BanUser } from '../../../lib/User';

function UserProfile({ user , BackTriggered , setFetchedUsers}) {
  
  const [userCars , setUserCars] = useState([]);
  const [carDetailsOpened, setCarDetailsOpened] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [userBanned , setUserBanned] = useState(user?.banned);
  const [fetched, setFetched] = useState(false);
  const [noCars , setNoCars] = useState(false);
  
  useEffect(()=>{

    const GetUserCars = async (email)=>{
        const {Data} = await fetchUserCars(email);
        if(Data.length == 0) setNoCars(true);
        setUserCars(Data);
        setFetched(true);
    }

    if(!fetched)
      GetUserCars(user?.email);

  }, [userCars, user?.email])

  const HandleBack = ()=>{
    if(carDetailsOpened){
      setCarDetailsOpened(false);
      BackTriggered("CarDetails");
    }else{
      setFetchedUsers(false);
      BackTriggered("Cars");
    }
  }

  const HandleBanUser = async (userId , action)=>{
    const {User} = await BanUser(userId, action);
      setUserBanned(User.banned);
      setFetched(false);
  }

  return (
    <>
      <Button className="rounded-xl mb-5" onClick={HandleBack}>
        <FaChevronLeft />
        </Button>
         

         {carDetailsOpened ? (
              <UserCar car={selectedCar}
               setCarDetailsOpened={setCarDetailsOpened}
               setUserCars={setUserCars}
               userCars={userCars}/>
            ) : userCars?.length > 0 || noCars ? (
              <>
              <div className="border rounded-lg p-2 ml-10"></div>
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={user.imageUrl}
                      alt={`${user.username}'s profile`}
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold">{user.username || 'Anonymous'}</h2>
                      {user.email && <p className="text-sm text-gray-600">{user.email}</p>}
                      {userBanned && <p className="text-sm text-red-600">Banned</p>}
                    </div>
                  </div>
                  {!userBanned && !user?.role.isAdmin ? (<Button className="bg-red-500 hover:bg-red-600 rounded-xl"
                          onClick={()=>HandleBanUser(user?.id, "Ban")} >Ban</Button>)
                          : !user?.role.isAdmin ? (<Button className="bg-green-400 hover:bg-green-600 rounded-xl"
                            onClick={()=>HandleBanUser(user?.id, "Unban")} >Unban</Button>) : null}
                </div>

                <div className="mt-10">
                  <div className="border rounded-lg overflow-hidden">
                    <Table className="table-auto w-full">
                      <TableHeader className="bg-gray-300">
                        <TableRow>
                          <TableHead className="w-[5%]"></TableHead>
                          <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">Car</TableHead>
                          <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">Model</TableHead>
                          <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">
                            Deployment Date
                          </TableHead>
                          <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">Price</TableHead>
                          <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">
                            Category
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userCars.map((car, index) => (
                          <TableRow key={index} className="hover:bg-gray-100">
                            <TableCell className="text-center text-sm text-gray-700 font-medium">{car.id}</TableCell>
                            <TableCell className="text-left text-sm text-gray-800 font-semibold">{car.listing_title}</TableCell>
                            <TableCell className="text-left text-sm text-gray-800">{car.model}</TableCell>
                            <TableCell className="text-sm text-blue-700">{new Date(car.createdOn).toLocaleDateString()}</TableCell>
                            <TableCell className="text-sm text-green-700 font-bold">
                              {car.price}
                              <span className="text-sm text-green-600">$</span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 italic">{car.category}</TableCell>
                            <TableCell className="flex justify-end">
                              <Button
                                onClick={() => {
                                  setCarDetailsOpened(true);
                                  setSelectedCar(car);
                                }}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            ) : 
            !noCars && (<div className="flex flex-col mt-[20%] items-center justify-center text-center">
              <Loader className="text-black" />
            </div>)
            }

      
    </>
  );  
}

export default UserProfile;
