'use client'

import  {useState, useEffect, React}  from 'react';
import Link from 'next/link';
import {Button} from '../../../components/ui/button'
import { useUser } from '@clerk/nextjs';
import CarCard from './../../../components/CarCard'
import { FaRegTrashCan } from "react-icons/fa6";
import {storage} from '../../../lib/firbase';
import { deleteObject, ref } from 'firebase/storage';
import {supabase} from './../../../lib/initSupabase';
import Loader from '../../../components/Loader2';

function MyListing() {
  const { user } = useUser();
  const [carList, setCarList] = useState([]);
  const InGarage = true;
  const [fetched , setFetched] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user && !fetched) UserCarListing();
  }, [user]);
  

  const UserCarListing = async () => {
    const {data} = await supabase.from('CarListing')
      .select('*,CarImages(*)')
      .eq('user', user?.primaryEmailAddress?.emailAddress)
      .order('id', { ascending: false })
    setCarList(data)
    setFetched(true);
    setLoading(false);
    
  };

  const HandleRemoveCar = async (e, item) => {
    e.preventDefault();
    
    try {
      for(let image of item.CarImages){
        const target_image = image?.imageUrl
        const storageRef = ref(storage, target_image);
        
        await deleteObject(storageRef);
        console.log('Image successfully deleted from Firebase');
      }    

      await supabase.from('CarImages').delete().eq('CarListingId', item.id)
      
      const response = await supabase.from('CarListing').delete().eq('id', item.id)
      if (response) {
        setCarList(prevCarList => prevCarList.filter(car => car?.id !== item?.id));
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-centermt mt-20">
          <Loader/>
        </div>
      </>
    );
  }
  

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-3xl'>My cars</h2>
        <Link href={'/add-car'}>
          <Button>Add New Car</Button>
        </Link>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-4'>
        {carList?.map((item, index) => (
          <div key={index}>
            <CarCard car={item} Ingarage={InGarage} />
            <div className='flex p-2 gap-5 rounded-lg justify-between'>
              <Link href={'/add-car?mode=edit&id=' + item.id} className='w-full'>
                <Button variant='outline' className='w-full bg-slate-200 hover:bg-slate-400'>Edit</Button>
              </Link>
              <Button className='bg-red-200 hover:bg-red-500' onClick={(e) => HandleRemoveCar(e, item)}>
                <FaRegTrashCan />
              </Button>
            </div>
          </div>  
        ))}
      </div>
    </div>
  );
}

export default MyListing;
