import {supabase} from './initSupabase'
import moment from 'moment';

export async function fetchCarData(carId){

    const { data, error } = await supabase
          .from('CarListing')
          .select('*, CarImages(*)')
          .eq('id', carId)
          .single();

    return {CarData : data , error : error};      
    
}

export async function fetchUserCars(emailAddress){

    const {data , error} = await supabase.from('CarListing')
      .select('*,CarImages(*)')
      .eq('user', emailAddress)
      .order('id', { ascending: true })

    return {Data : data , error: error};    
}

export async function fetchCarMessages(carId , emailAddress){

    const {data , error} = await supabase
        .from('CarMessages')
        .select('*')
        .eq('CarId',carId)
        .eq('sender',emailAddress);

    return {MessageData : data , error: error};    
}

export async function fetchFavoriteCar(carId , emailAddress){

    const {data , error} = await supabase.from('FavoriteCars')
        .select('car_id')
        .eq('car_id',carId)
        .eq('user_email',emailAddress)

    return {FavoriteData : data , error: error};    
}

export async function SendMessage(message , senderEmail, owner, carId, messageExists){
    console.log(messageExists)
    if(messageExists === false){
        const { error } = await supabase.from('CarMessages').insert({
        message: message,  
        sender: senderEmail,
        receiver : owner,
        CarId: carId,
        car_owner: owner
      });  
      
      return {error : error}
      
    }else if(messageExists){
        const {error} = await supabase.from('CarMessages').update({
            message: message,  
            sender: senderEmail,
            receiver : owner,
            CarId: carId,
            car_owner: owner
          })
      .eq('CarId',carId)
      .eq('sender',senderEmail); 
      
      return {error : error}

    }

}

export async function AddtoFavorite(emailAddress , carId ,  isFavorite){

    if(isFavorite){
            const{error } = await supabase.from('FavoriteCars').delete()
            .eq('car_id',carId)
            .eq('user_email',emailAddress);

            return {wasFavorite : true , error : error};
    }else{
        const {error} = await supabase.from('FavoriteCars').insert([{
            user_email:emailAddress,
            car_id:carId,
          }])
        
          return {wasFavorite: false, error: error };

    }    

}

export async function EditCar(mode , recordId, formData , carFeatures, emailAddress){
    if(mode === "edit"){
        const {data , error} = await supabase.from('CarListing').update({
            ...formData,
            features: carFeatures,
            user: emailAddress,
            createdOn: moment().format('YYYY-MM-DD'),
        }).eq('id', recordId).select();

        console.log(error);

        return {data:data , error: error};

    }else{
        const {data , error} = await supabase.from('CarListing').insert({
            ...formData,
            features: carFeatures,
            user: emailAddress,
            createdOn: moment().format('YYYY-MM-DD'),
        }).select();

        console.log(error);

        return {data : data , error: error};
    }
}