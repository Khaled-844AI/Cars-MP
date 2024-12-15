'use client';

import React, { useState } from 'react';
import { RedirectToSignIn, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for the hamburger menu

function Header() {
  const { user, isSignedIn } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin;
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle


  return (
    <header className="bg-white shadow-sm p-2 no-scrollbar">
      <div className="max-w-8xl mx-auto flex justify-between items-center">

        <Link href="/">
            <img src="/logo.svg" alt="Logo" className="w-24 cursor-pointer" />
        </Link>


        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-14">

            <Link href="/">
              <li className="text-lg font-semibold hover:scale-150 transition-transform cursor-pointer hover:text-primary">
                Home
              </li>
            </Link>

          <li className="text-lg font-semibold hover:scale-150 transition-transform cursor-pointer hover:text-primary">
            Search
          </li>

            <Link href="/new-car">
              <li className="text-lg font-semibold hover:scale-150 transition-transform cursor-pointer hover:text-primary">
                New
              </li>
            </Link>

            {user?.publicMetadata?.isDealer && <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              <li className="text-lg font-semibold hover:scale-105 transition-transform cursor-pointer hover:text-primary">
                Garage
              </li>
            </Link>}

          {isAdmin && (
            <Link href="/admin">
              <li className="text-lg text-blue-500 font-semibold hover:scale-150 transition-transform cursor-pointer hover:text-primary">
                Admin
              </li>
            </Link>
          )}
        </ul>

        {/* User Actions */}
        <div className="hidden md:flex gap-4 items-center">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600" />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <ul className="flex flex-col items-center bg-white shadow-md p-4 gap-4 md:hidden">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <li className="text-lg font-semibold hover:scale-105 transition-transform cursor-pointer hover:text-primary">
                Home
              </li>
            </Link>

          <li className="text-lg font-semibold hover:scale-105 transition-transform cursor-pointer hover:text-primary">
            Search
          </li>
            <Link href="/new-car" onClick={() => setIsMenuOpen(false)}>
              <li className="text-lg font-semibold hover:scale-105 transition-transform cursor-pointer hover:text-primary">
                New
              </li>
            </Link>

            {user?.publicMetadata?.isDealer && <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              <li className="text-lg font-semibold hover:scale-105 transition-transform cursor-pointer hover:text-primary">
                Garage
              </li>
            </Link>}

          {isAdmin && (
            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
              <li className="text-lg text-blue-500 font-semibold hover:scale-105 transition-transform cursor-pointer hover:text-primary">
                Admin
              </li>
            </Link>
          )}

          {/* Mobile User Actions */}
          <div className="flex gap-4 items-center mt-4">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600" />
            )}
          </div>
        </ul>
      )}
    </header>
  );
}

export default Header;
