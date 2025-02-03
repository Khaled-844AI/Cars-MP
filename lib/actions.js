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

    return {Cars : data , error: error};    
}

export async function fetchUserFavorites(emailAddress) {

    const { data, error } = await supabase
        .from('FavoriteCars')
        .select(`
            CarListing (
                *,
                CarImages (*)
            )
        `)
        .eq('user_email', emailAddress)
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching user favorites:', error);
        return { Favorites: null, error };
    }

    const flattenedFavorites = data.map(favorite => ({
        ...favorite.CarListing, 
        FavoriteId: favorite.id 
    }));

    return { Favorites: flattenedFavorites, error: null };
}

export async function fetchFavoriteCar(carId , emailAddress){

    const {data , error} = await supabase.from('FavoriteCars')
        .select('car_id')
        .eq('car_id',carId)
        .eq('user_email',emailAddress)

    return {FavoriteData : data , error: error};    
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

        return {data : data , error: error};
    }
}