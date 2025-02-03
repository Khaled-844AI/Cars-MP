import{ React, useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { UploadImages , RemoveImage} from '../../../lib/ImageActions';

function UploadImage({ uploadImagesTriggered, setLoader, setUploadDone, carInfo , onCarAllowedChange, NotAllowedTriggered}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onImageSelected = async (event) => {
    setLoader(true);
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    event.target.value = null;
    const file = files[0]
    if(file){
      const form_data = new FormData(); 
      form_data.append('image',file)

      try {
        const response = await axios.post('http://localhost:5000/', form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const predicted =  response.data.predicted
        if(predicted == 'modern car'){
          onCarAllowedChange(true);
        }else{
          NotAllowedTriggered(true)
        }
        
      } catch (error) {
          console.error('Error uploading image:', error); 
      }finally{
        setLoader(false);
      }
    }
  };

  const HandleRemoveUploadedImage = async (e , selected_image)=>{
      e.preventDefault();
      const target_image = selected_image.imageUrl

      await RemoveImage(target_image);  

      if(carInfo){
        carInfo.CarImages = carInfo?.CarImages.filter(image => image.imageUrl !== target_image);
        
        setUploadedImages((prev) => prev.filter(image => image?.imageUrl !== target_image));
      }
  }

  useEffect(() => {
    if (uploadImagesTriggered) {
      SaveImages();
    }
    if (carInfo) {
      setUploadedImages(carInfo.CarImages);
    }  
    if((carInfo?.images?.length === 0 || !carInfo)&& uploadedImages.length === 0 && selectedFiles.length === 0){
      onCarAllowedChange(false)
      NotAllowedTriggered(false)
    }

  }, [uploadImagesTriggered, carInfo, uploadedImages, selectedFiles]);

  const handleImageRemove = (selectedImage) => {
    setSelectedFiles((prev) => prev.filter(image => image !== selectedImage))
    if(carInfo)
      carInfo.images = carInfo?.images?.filter(image => image.name !== selectedImage.name);
    
    if(uploadedImages.length === 0 && selectedFiles.length === 0){
      onCarAllowedChange(false);
      NotAllowedTriggered(false);
    }
  };

  const SaveImages = async () => {
    try {
      const { error } = await UploadImages(selectedFiles , uploadImagesTriggered);

      if(!error){  
        setUploadDone(true);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error uploading images: ", error);
    }
  };

  return (
    <div>
      <h2 className='font-medium text-xl mb-5'>Upload Car Images</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5'>
        {selectedFiles.map((image, index) => (
          <div key={index} className='relative'>
            <IoClose onClick={() => handleImageRemove(image)} className='absolute m-1 text-lg text-black hover:cursor-pointer' />
            <img src={URL.createObjectURL(image)} className='w-full h-full object-cover border border-neutral-400 rounded-xl' />
          </div>
        ))}
        {uploadedImages[0] && uploadedImages.map((element, index) => (
          <div key={index} className='relative'>
            <IoClose onClick={(e)=>HandleRemoveUploadedImage(e , element)} className='absolute m-1 text-lg text-black hover:cursor-pointer' />
            <img src={element?.imageUrl} className='w-full h-full object-cover border border-neutral-400 rounded-xl' />
          </div>
        ))}

        <label htmlFor='upload-images'>
          <div className='border rounded-xl border-dotted border-primary bg-blue-200 p-10 cursor-pointer hover:shadow-xl'>
            <h2 className='text-lg text-center text-primary'> + </h2>
          </div>
        </label>
        <input type='file' multiple={true} id='upload-images' className='opacity-0' onChange={onImageSelected} />
      </div>
    </div>
  );
}

export default UploadImage;
