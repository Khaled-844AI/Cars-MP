'use client'

import React from 'react';
import Header from '../../components/Header';
import MyListing from './components/Mylisting';
import  {Tabs, TabsContent, TabsList, TabsTrigger}  from "../../components/ui/tabs";



function Profile() {
    return (
      <div>
          <Header/>
          <div className='px-10 md:px-20 my-10'>
            
          <Tabs defaultValue="my-listing" className="w-full">
            <TabsList className='w-full flex justify-center mb-6 gap-5'>
              <TabsTrigger value="my-listing">My Cars</TabsTrigger>
            </TabsList>
            <TabsContent value="my-listing"> <MyListing/> </TabsContent>
          </Tabs>
  
            
          </div>
      </div>
    )
  }

export default Profile