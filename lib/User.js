'use server'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { supabase } from './initSupabase'


export const addUserToSupabase = async (user)=>{
    const { emailAddresses , firstName , lastName} = user;
    const email = emailAddresses[0]?.emailAddress;

    const {data1 , error1} = await supabase.from("Users")
    .select("*")
    .eq('email',email);

    if(error1){
        console.error("Error Fetching For the user :", error);
    }

    if(data1 && data1[0]){
        return;
    }

    const {error} = supabase.from("Users").insert({
        email : email,
        first_name : firstName,
        last_name : lastName,
        is_admin : false,
        created_at: new Date(),
    });

    if(error){
        console.error("Error Adding User :", error);
    }

    return;

}

export async function GetUser(userId){

    const response = await clerkClient.users.getUser(userId);

    const plainUser = JSON.parse(JSON.stringify(response));

    return {User : plainUser};
}

export async function BanUser(userId, action) {
    let response;

    if (action === "Ban") {
        response = await clerkClient.users.banUser(userId);
    } else if (action === "Unban") {
        response = await clerkClient.users.unbanUser(userId);
    } else {
        return;
    }

    const plainUser = JSON.parse(JSON.stringify(response));
    return { User: plainUser };
}




export async function UpdateUser(userId , isBuyer, isDealer){
    if(isBuyer && userId){
        try{
            await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                isBuyer: true,
            },
            })
        }catch(error){
            console.log(error);
        }    
    }else if (isDealer && userId){
            await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                isDealer: true,
            },
            })
        
            
    }  

}

/*
_User {
  id: 'user_123',
  passwordEnabled: true,
  totpEnabled: false,
  backupCodeEnabled: false,
  twoFactorEnabled: false,
  banned: false,
  locked: false,
  createdAt: 1708103362688,
  updatedAt: 1708103702285,
  imageUrl: 'https://img.clerk.com/eyJ...',
  hasImage: false,
  primaryEmailAddressId: 'idn_123',
  primaryPhoneNumberId: null,
  primaryWeb3WalletId: null,
  lastSignInAt: null,
  externalId: null,
  username: null,
  firstName: 'Test',
  lastName: 'Clerk',
  publicMetadata: { example: 'metadata' },
  privateMetadata: {},
  unsafeMetadata: {},
  emailAddresses: [
    _EmailAddress {
      id: 'idn_123',
      emailAddress: 'testclerk123@gmail.com',
      verification: [_Verification],
      linkedTo: []
    }
  ],
  phoneNumbers: [],
  web3Wallets: [],
  externalAccounts: [],
  lastActiveAt: null,
  createOrganizationEnabled: true
}
*/