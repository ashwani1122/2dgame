import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 character"),
  type: z.enum(["user", "admin"], {
    message: "Type must be either 'user' or 'admin'",
  }),
});
export const SigninSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 character"),
});
export const DeleteElementSchema = z.object({
  id: z.string(),
});
export const updateMetadataSchema = z.object({
  avatarId: z.string(),
});

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: "User" | "Admin";
      userName: string;
      userAvatarId: string;
    }
  }
}
export const CreateSpaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  dimensions: z
    .string()
    .regex(
      /^[0-9]{1,4}x[0-9]{1,4}$/,
      "Dimensions must be in the format 'width x height' (e.g., '800x600')",
    ),
  mapId: z.string(),
});

export const AddElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string().url("Image URL must be a valid URL"),
  width: z.number().min(1, "Width must be at least 1 pixel"),
  height: z.number().min(1, "Height must be at least 1 pixel"),
  static: z.boolean(),
});

export const CreateAvatarSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  imageUrl: z.string(),
});

export const UpdateAvatarSchema = z.object({
  imageUrl: z.string().url("Image URL must be a valid URL"),
});

export const CreateMapSchema = z.object({
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  dimensions: z
    .string()
    .regex(
      /^[0-9]{1,4}x[0-9]{1,4}$/,
      "Dimensions must be in the format 'width x height' (e.g., '800x600')",
    ),
    name: z.string().min(3, "Name must be at least 3 characters long"),
  defaultElementId: z.array(
    z.object({
      elemenId: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  ),
});
