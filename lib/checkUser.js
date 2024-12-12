import { db } from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  let user;
  try {
    user = await currentUser(); // Ensure you're calling this in a server-side context
    if (!user) {
      console.log("No user found.");
      return null;
    }

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    const username = name.split(" ").join("-") + user.id.slice(-4);

    await clerkClient().users.updateUser(user.id, {
      username,
    });

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
