import { clerkClient } from "@clerk/clerk-sdk-node";

export async function POST(req){

    const {userId , isBuyer, isDealer} = await req.json();

    if (!userId) {
        return new Response(JSON.stringify({ message: 'User Not Found' }), {
          status: 400,
        });
      }

    const data = isBuyer ? {isBuyer : true} : isDealer ? {isDealer : true} : null;
    try{
        const response = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: data,
        })
        return new Response(JSON.stringify({ message: 'User was Updated' }), {
            status: 200,
        });
    }catch(error){
      return new Response(JSON.stringify({ message: error}), {
        status: 500,
    });
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