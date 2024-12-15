import {clerkClient} from '@clerk/clerk-sdk-node'



export async function GET(req){
    console.log('here');
    const response = await clerkClient.users.getUserList();

    if(response){
        return new Response(JSON.stringify({ users: response.data }), {
            status: 200,
        });
    }

    return new Response(JSON.stringify({ message: 'Server Error' }), {
        status: 500,
    });
}