import { clerkClient } from '@clerk/clerk-sdk-node';

export async function POST(req) {
  try {

    const { senderEmail } = await req.json();

    console.log(senderEmail);

    if (!senderEmail) {
      console.log('yes');
      return new Response(JSON.stringify({ message: 'Email is required' }), {
        status: 400,
      });
    }

    const users = await clerkClient.users.getUserList({
      emailAddress: senderEmail,
    });

    if (users && users.data.length > 0) {
      return new Response(JSON.stringify(users.data[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }
  } catch (error) {

    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user profile' }),
      { status: 500 }
    );
  }
}
