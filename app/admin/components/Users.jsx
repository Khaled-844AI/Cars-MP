'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { IoMdSettings } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetUsers, RemoveUser } from '../action';
import { FaTrash } from "react-icons/fa6";
import { IoCarSportSharp } from "react-icons/io5";
import UserProfile from './UserProfile';
import Loader from './../../../components/Loader';
import  AlertAccountCard  from './../../../components/AlertCard';

function Users() {
  const [fetched, setFetched] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [profileOpen, setProfileOpen] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        if (!fetched) {
          const { users } = await GetUsers();
          console.log(users);
          setFetched(true);
          setFetchedUsers(users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      }
    };

    if (!fetched)
      getUsers();
  }, [fetched]);

  const HandleRemoveUser = async (userId) => {
    const response = await RemoveUser(userId);
    if (response.success) {
      setFetchedUsers(fetchedUsers.filter((user) => user?.id !== userId));
    }
    setShowAlert(false);
  };

  const HandleUserProfile = (user) => {
    setProfileOpen(true);
    setSelectedUser(user);
  };

  const BackTriggered = (CurrentPage) => {
    if (CurrentPage === "Cars") {
      setProfileOpen(false);
    } else if (CurrentPage === "CarDetails") {
      setProfileOpen(true);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowAlert(true);
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setUserToDelete(null);
  };

  return (
    <div className="p-4 relative">
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : !profileOpen ? (
        <>
          {fetched ? (
            fetchedUsers.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[90vh] overflow-y-auto overflow-x-auto">
                  <Table className="table-auto w-full">
                    <TableHeader className="bg-gray-300">
                      <TableRow>
                        <TableHead className="w-[5%] hidden sm:table-cell"></TableHead>
                        <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">
                          Name
                        </TableHead>
                        <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200">
                          Email
                        </TableHead>
                        <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200 hidden md:table-cell">
                          Banned
                        </TableHead>
                        <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200 hidden lg:table-cell">
                          Roles
                        </TableHead>
                        <TableHead className="font-mono text-lg font-bold text-slate-900 dark:text-slate-200 hidden xl:table-cell">
                          Last Signed In
                        </TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {fetchedUsers.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="hidden sm:table-cell">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 mr-4">
                              <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-sm sm:text-base">
                            {user?.username || "N/A"}
                          </TableCell>
                          <TableCell className="text-blue-600 text-sm sm:text-base">
                            {user?.email || "N/A"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user?.banned?.toString()}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {user?.role?.isAdmin && <span><span className="font-bold">Admin </span>- </span>}
                            {user?.role?.isBuyer && (user?.role?.isAdmin ? ' - Buyer' : 'Buyer')}
                            {user?.role?.isDealer && 'Car Dealer'}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {user?.lastSignInAt
                              ? new Date(user?.lastSignInAt).toLocaleString()
                              : "N/A"}
                          </TableCell>

                          <TableCell className="flex justify-between items-center">
                            {!user?.role?.isAdmin && (
                              <Button
                                className="bg-red-400 hover:bg-red-600 w-[40%] rounded-xl text-sm"
                                onClick={() => confirmDelete(user)}
                              >
                                <FaTrash />
                              </Button>
                            )}
                            <div className="flex-grow"></div>
                            {user?.role?.isDealer ? (
                              <Button
                                className="bg-gray-300 text-black hover:bg-white hover:text-black w-[40%] rounded-xl text-sm"
                                onClick={() => HandleUserProfile(user)}
                              >
                                <IoCarSportSharp />
                              </Button>
                            ) : (
                              <Button
                                className="bg-gray-300 text-black hover:bg-white hover:text-black w-[40%] rounded-xl text-sm"
                                onClick={() => HandleUserProfile(user)}
                              >
                                <IoMdSettings />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div>No users found.</div>
            )
          ) : (
            <div className="flex flex-col mt-[20%] items-center justify-center text-center">
              <Loader className="text-black" />
            </div>
          )}
        </>
      ) : (
        <UserProfile user={selectedUser} BackTriggered={BackTriggered} setFetchedUsers={setFetched} />
      )}

      {showAlert && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <AlertAccountCard
              onConfirm={() => HandleRemoveUser(userToDelete?.id)}
              onCancel={cancelDelete}
              toDelete={"user"}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Users;