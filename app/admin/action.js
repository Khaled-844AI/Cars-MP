'use server'
import { clerkClient } from "@clerk/clerk-sdk-node";
import { currentUser } from "@clerk/nextjs/server";

export async function GetUsers() {

  const user = await currentUser();

  if(!user?.publicMetadata?.isAdmin){
    throw new Error("You r not authorised");
  }

  try {
    
    const response = await clerkClient.users.getUserList();


    const plainUsers = response.data.map(user => ({
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress || 'No Email',
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
      username: user.username || 'N/A',
      imageUrl: user.imageUrl || null ,
      banned: user?.banned,
      role : user.publicMetadata
    }));

    return { users: plainUsers };
  } catch (error) {
    console.error("Error fetching users from Clerk:", error);
    throw new Error("Failed to fetch users");
  }
}


export async function RemoveUser(userId) {
  try {
    const user = await currentUser();

    if (!user?.publicMetadata?.isAdmin) {
      throw new Error("You are not authorized");
    }

    // Delete the user
    const response = await clerkClient.users.deleteUser(userId);


    return {
      success: true,
      message: "User removed successfully",
      deletedUser: {
        id: response.id,
        object: response.object,
        deleted: response.deleted,
      },
    };
  } catch (error) {
    console.error("Error removing user:", error);

    return {
      success: false,
      message: error.message || "Failed to remove user",
    };
  }
}
