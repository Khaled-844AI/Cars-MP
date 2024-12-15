import { Separator } from "@/components/ui/separator";
import { FaCheck } from "react-icons/fa";
import React from "react";
import { Button } from "@/components/ui/button";
import { deleteObject, ref } from "firebase/storage";
import {storage} from '../../../lib/firbase';
import { supabase } from "../../../lib/initSupabase";

function UserCar({ car , setCarDetailsOpened, setUserCars, userCars}) {

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
        setUserCars(userCars.filter((car) => car.id !== item.id));
        setCarDetailsOpened(false);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <>
      {/* Main Container to Prevent Overflow */}
      <div className="overflow-hidden">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-5">
          <h2 className="font-bold text-center text-3xl p-3">{car.model}</h2>
          <Separator className="bg-black m-6 w-[50%]" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Car Images */}
          {car.CarImages?.map((image, index) => (
            <div key={index} className="p-2">
              <img
                className="w-full h-auto rounded-lg object-cover"
                src={image.imageUrl}
                alt={`Car Image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-lg mt-6 rounded-lg p-4">
          <span className="font-semibold text-gray-700">Features:</span>
          <div className="mt-5">
            {car?.features && car.features.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-2 rounded-md">
                    <FaCheck className="text-green-500 mr-2 text-lg" />
                    <p className="text-gray-600">{feature}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mt-2">No features available</p>
            )}
          </div>
        </div>

        <Separator className="bg-gray-400 mb-10" />

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Price", value: `$${car.price}`, color: "text-green-500" },
            { label: "Condition", value: car.condition, color: "text-blue-400" },
            { label: "Gear Type", value: car.gear_type, color: "text-gray-600" },
            { label: "Fuel Type", value: car.fuel_type, color: "text-gray-600" },
            { label: "Year", value: car.year, color: "text-gray-600" },
            { label: "Mileage", value: `${car.mileage} km`, color: "text-gray-600" },
          ].map((detail, index) => (
            <div
              key={index}
              className="text-lg mb-6 border rounded-lg p-4 shadow-lg"
            >
              <span className="font-semibold text-gray-700">{detail.label}:</span>
              <span className={`block ${detail.color} mt-1`}>{detail.value}</span>
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div className="text-lg mt-6 rounded-lg p-4">
          <span className="font-semibold text-gray-700">Description:</span>
          <p className="text-gray-600 mt-2">{car.description}</p>
        </div>

        {/* Remove Button */}
        <div className="flex justify-center">
          <Button className="hover:bg-red-500" onClick={(e)=>HandleRemoveCar(e,car)}>Remove</Button>
        </div>
      </div>
    </>
  );
}

export default UserCar;
