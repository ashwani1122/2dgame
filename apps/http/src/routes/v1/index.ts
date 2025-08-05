import { Response, Router, Request } from "express";
import client from "@repo/db/client";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "src/config.js";
import { SigninSchema, SignupSchema } from "src/types/index.js";
import { userRouter } from "./user.js";
import { adminRouter } from "./admin.js";
import { spaceRouter } from "./space.js";

export const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.status(200).json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
router.post("/signin", async (req: Request, res: Response) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(403).json({
      message: "Invalid request data",
    });
  }

  const user = await client.user.findUnique({
    where: {
      username: parsedData.data.username,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: "user not found",
    });
  }
  const isPasswordValid = await bcrypt.compare(
    parsedData.data.password,
    user.password,
  );
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET);

  res.status(200).json({
    message: "User signed in successfully",
    token: token,
  });
});

router.get("/elements", async (req: Request, res: Response) => {
    const elements = await client.element.findMany();
    res.status(200).json({elements : elements.map((element) => ({
    id: element.id,
    imageUrl: element.imageUrl,
    width: element.width,
    height: element.height,
    static: element.static,
    }))});
});

router.get("/avatars", async (req: Request, res: Response) => {
    const avatars = await client.avatar.findMany();
    res.status(200).json({
        avatars: avatars.map((avatar) => ({
            id: avatar.id,
            imageUrl: avatar.imageUrl,
            name: avatar.name,
        })),
    });
});
router.use("/user", userRouter);

router.use("/admin", adminRouter);

router.use("/space", spaceRouter);
