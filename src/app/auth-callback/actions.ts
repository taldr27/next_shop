"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthStatus = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log("User session from getKindeServerSession:", user);
  if (!user) {
    console.error("User session is missing in production.");
    return { success: false };
  }

  console.log("auth callback action", user);

  if (!user?.id || !user?.email) {
    console.log("Invalid user data");
    throw new Error("Invalid user data");
  }

  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  console.log("auth callback action", existingUser);

  if (!existingUser) {
    console.log("Creating user in dbbb");
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }

  return { success: true };
};
