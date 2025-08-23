import { Router } from "express";
import { updateMetadataSchema } from "src/types";

import client from "@repo/db/client";
import { userMiddleware } from "src/middleware/user";

export const userRouter = Router();
console.log("User Router initialized");
userRouter.post("/metadata", userMiddleware, async (req, res) => {
  const parsedData = updateMetadataSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
  try {
    await client.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });
    res.status(200).json({
      message: "User metadata updated successfully",
    });
  } catch (error) {
    console.error("Error updating user metadata:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdString = (req.query.ids ?? "[]") as string;
  const userIds = userIdString.slice(1, userIdString?.length - 2).split(",");
  const metadata = await client.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      avatar: true,
    },
  });
  
  res.json({
    avatars: metadata.map((user) => ({
      userId: user.id,
      avatarId: user.avatar?.imageUrl,
    })),
  });
});
