import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getUserIdTag } from "./cache";

export const getUserById = async (id: string) => {
  "use cache";
  cacheLife("hours");
  cacheTag(getUserIdTag(id));
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        address: true,
        picture: true,
        pictureId: true,
        tel: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by id", error);
    return null;
  }
};
