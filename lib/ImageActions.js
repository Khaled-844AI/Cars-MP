import { supabase } from "./initSupabase";
import { storage } from "./firbase";
import { getDownloadURL, uploadBytes, ref, deleteObject } from "firebase/storage";
import moment from "moment";


export async function UploadImages(selectedImages, uploadImagesTriggered){

    for (const image of selectedImages) {
        const fileName = moment().format('YYYY-MM-DD_HH-mm-ss') + ".jpeg";
        const refStorage = ref(storage, "car-marketplace/" + fileName);
        const metaData = {
          contentType: 'image/jpeg'
        };

        await uploadBytes(refStorage, image, metaData);

        const downloadUrl = await getDownloadURL(refStorage);
        const {error} = await supabase.from('CarImages').insert({
          imageUrl: downloadUrl,
          CarListingId: uploadImagesTriggered
        });

        if(error){
          return{error : error};
        }

      }

      return {error:null};
} 

export async function RemoveImage(selectedImage){

  const storageRef = ref(storage, selectedImage);

  await deleteObject(storageRef);
  await supabase.from('CarImages').delete().eq('imageUrl', selectedImage);

} 