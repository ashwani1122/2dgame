import { Router } from "express";
import {
  AddElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "src/types";
import client from "@repo/db/client";
import { userMiddleware } from "src/middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, async (req, res) => {
  console.log("Space creation request received");
  const parsedData = CreateSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
  if (!parsedData.data.mapId) {
    console.log("Map ID is required for space creation");
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[0]),
        height: parseInt(parsedData.data.dimensions.split("x")[1]),
        creatorId: req.userId,
      },
    });
    res.status(201).json({
      spaceId: space.id,
    });
  }
  const map = await client.map.findUnique({
    where: {
      id: parsedData.data.mapId,
    },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });
  if (!map) {
    return res.status(404).json({
      message: "Map not found",
    });
  }
  let space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId,
      },
    });
    await client.spaceElements.createMany({
      data: map.mapElements.map((element) => ({
        spaceId: space.id,
        elementId: element.elementId,
        x: element.x!,
        y: element.y!,
      })),
    });

    return space;
  });

  res.status(201).json({
    message: "Space created successfully",
    spaceId: space.id,
  });
});

spaceRouter.delete("/:spaceId", userMiddleware, async (req, res) => {
  const { spaceId } = req.params;
  const space = await client.space.findUnique({
    where: {
      id: spaceId,
    },
    select: {
      creatorId: true,
    },
  });
  if (!space) {
    return res.status(400).json({
      message: "Space not found",
    });
  }
  if (space.creatorId !== req.userId) {
    return res.status(403).json({
      message: "You are not authorized to delete this space",
    });
  }
  await client.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });
  res.status(200).json({
    message: `Space with ID ${spaceId} deleted successfully`,
  });
});

spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });

  res.json({
    spaces: spaces.map((space) => ({
    id: space.id,
    name: space.name,
    thumbnail: space.thumbnail,
    dimensions: `${space.width}x${space.height}`,
    })),
  });
});

spaceRouter.post("/element", async (req, res) => {
  const parsedData = AddElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
  const space = await client.space.findUnique({
    where: {
      id: parsedData.data.spaceId,
      creatorId: req.userId!,
    },
    select: {
      width: true,
      height: true,
    },
  });
  if (!space) {
    return res.status(404).json({
      message: "Space not found",
    });
  }
  await client.spaceElements.create({
    data: {
      spaceId: parsedData.data.spaceId,
      elementId: parsedData.data.elementId,
      x: parsedData.data.x,
      y: parsedData.data.y,
    },
  });
  res.status(201).json({
    message: "Element added to space successfully",
  });
});

spaceRouter.delete("/element", userMiddleware, async (req, res) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }
  const spaceElement = await client.spaceElements.findFirst({
    where: {
      id: parsedData.data.id,
    },
    select: {
      space: true,
    },
  });
  if (
    !spaceElement?.space.creatorId ||
    spaceElement.space.creatorId !== req.userId
  ) {
    return res.status(403).json({
      message: "You are not authorized to delete this element",
    });
  }
  await client.spaceElements.delete({
    where: {
      id: parsedData.data.id,
    },
  });
  res.status(200).json({
    message: "Element deleted from space successfully",
  });
});

spaceRouter.get("/:spaceId", async (req, res) => {
  const { spaceId } = req.params;
  const space = await client.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      elements: {
        include: {
          element: true,
        },
      },
    },
  });
  if (!space) {
    return res.status(404).json({
      message: "Space not found",
    });
  }

  res.status(200).json({
    dimensions: `${space.width}x${space.height}`,
    elements: space.elements.map((element) => ({
      id: element.id,
      element: {
        id: element.element.id,
        width: element.element.width,
        height: element.element.height,
        imageUrl: element.element.imageUrl,
        static: element.element.static,
      },
      x: element.x,
      y: element.y,
    })),
  });
});
