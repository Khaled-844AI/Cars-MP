import { clerkClient } from '@clerk/clerk-sdk-node';

export async function POST(req) {
  try {
    // Extract senderEmail from request body
    const { senderEmail } = await req.json();

    // Validate email existence
    if (!senderEmail) {
      return new Response(JSON.stringify({ message: 'Email is required' }), {
        status: 400,
      });
    }

    // Fetch user profile using Clerk's SDK
    const users = await clerkClient.users.getUserList({
      emailAddress: senderEmail,
    });

    // Check if user is found and return the user data
    if (users && users.data.length > 0) {
      return new Response(JSON.stringify(users.data[0]), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user profile' }),
      { status: 500 }
    );
  }
}
