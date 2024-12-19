'use client'
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import CarDetails from '../../data/CarDetails.json';
import features from '../../data/features.json'
import InputField from './components/InputField';
import  Dropdown  from './components/Dropdown';
import TextAreaField from './components/TextAreaField';
import { Separator } from '../../components/ui/separator';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button'
import UploadImage from './components/UploadImage';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import {fetchCarData, EditCar} from '../../lib/actions'
import Loader from './../../components/Loader2'

function AddListing() {
  const [formData, setFormData] = useState([]);
  const [selectedFeatures , SetSelectedFeatures] = useState([])
  const [uploadImagesTriggered, setUploadImagesTriggered] = useState(null);
  const [loader, setLoader] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [carInfo, setCarInfo] = useState(null);
  const [carNotAllowed, setCarNotAllowed] = useState(false)
  const { user } = useUser();
  const SearchParams = useSearchParams()
  const mode = SearchParams.get('mode');
  const recordId = SearchParams.get('id');
  const [carAllowed , setCarAllowed] = useState(false);


  const handleFeaturesChange = (featureName, isChecked) => {
    setCarInfo((prevInfo) => {
      if(prevInfo){
        const updatedFeatures = isChecked 
          ? [...prevInfo?.features, featureName] 
          : prevInfo?.features?.filter((feature) => feature !== featureName);
          
        return { ...prevInfo , features: updatedFeatures };
      }

      return null
      
    });
    console.log(features.CarFeatures.filter((feature)=>(feature.name === featureName))[0].name);
    SetSelectedFeatures((prevFeature) => [...prevFeature , features.CarFeatures.filter((feature)=>(feature.name === featureName))[0].name])

  };

  const getRecordListing = async (recordId) => {
    const {CarData , error} = await fetchCarData(recordId)

    if(CarData && !error){
      setCarInfo(CarData); 
      SetSelectedFeatures(CarData.features);
      setCarAllowed(true);
      return;
    }
    return error;
  };
  
  useEffect(() => {
    if (mode === 'edit' && recordId !== null) {
      const error = getRecordListing(recordId);
      console.log(error);
    }
    
    
  }, [mode, recordId]);
  const handleFormChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCarAllowedChange = (isAllowed)=>{
      setCarAllowed(isAllowed);
  }

  const HandelCarNotAllowed = (notAllowed)=>{
    setCarNotAllowed(notAllowed);
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const {data , error} = await EditCar(
        mode,
        recordId,
        formData,
        carInfo?.features || selectedFeatures,
        user?.primaryEmailAddress?.emailAddress
      )

      if (data && !error) {
        setUploadImagesTriggered(data[0]?.id);
      }

    }catch (error) {
        console.error('Error inserting data:', error);
    }

  };

  return (
    <>
      <Header />
      <div className='px-10 md:px-20 my-10'>
        <h2 className='font-bold text-4xl mb-5'>Add New Car</h2>
        <form className='p-10 border rounded-xl' method='POST'>

          <div>
            <h2 className='font-medium text-xl mb-6'>Car details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {CarDetails.CarDetails.map((item, index) => (
                <div key={index}>
                  <label className='text-sm'>
                    {item.label} {item.required && <span className='text-red-600'>*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField 
                      item={item} 
                      handleFormChange={handleFormChange} 
                      carInfo={carInfo} 
                    />
                  ) : item.fieldType === "dropdown" ? (
                    <Dropdown 
                      item={item} 
                      handleFormChange={handleFormChange} 
                      carInfo={carInfo}
                    />
                  ) : item.fieldType === "textarea" ? (
                    <TextAreaField 
                      item={item} 
                      handleFormChange={handleFormChange} 
                      carInfo={carInfo}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <Separator className='my-6' />
          <div>
            <h2 className='font-bold text-medium my-5'>Features</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
            {features.CarFeatures.map((item, index) => (
              <div key={index} className='flex gap-2 items-center py-2'>
                {mode === "edit" && carInfo ? <Checkbox 
                  item={item} 
                  onCheckedChange={(check) => handleFeaturesChange(item.name, check)} 
                  checked={carInfo?.features?.includes(item.name)}
                /> :<Checkbox 
                item={item} 
                onCheckedChange={(check) => handleFeaturesChange(item.name, check)} 
                checked={carInfo?.features?.includes(item.name)}
              />}
                <h2 className='font-medium'>{item.label}</h2>
              </div>
            ))}

            </div>
          </div>

          <Separator className='my-6' />

          <UploadImage 
            uploadImagesTriggered={uploadImagesTriggered} 
            setUploadDone={setUploadDone} 
            setLoader={setLoader} 
            carInfo={carInfo}
            onCarAllowedChange={handleCarAllowedChange}
            NotAllowedTriggered={HandelCarNotAllowed}
          />


          {carAllowed ? <div className='mt-10 flex justify-center'>
            {!uploadDone ? (
              <>
                  {!loader ? <Button onClick={handleSubmitForm} disabled={loader}>
                                Save
                             </Button>
                  : <Loader/>}
              </>
            ) : (
              <>{redirect('/garage')}</>
            )}
          </div> : carNotAllowed ? <div className='mt-10 flex justify-center text-red-600 bg-red-300 rounded-lg p-5'>
                Sorry your car is not allowed to be here
          </div>:null}
        </form>
      </div>
    </>
  );
}

export default AddListing;
