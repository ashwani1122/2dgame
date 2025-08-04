import { Router } from "express";
import { adminMiddleware } from "src/middleware/admin";
import {  CreateAvatarSchema, CreateElementSchema, CreateMapSchema } from "src/types";
import client from "@repo/db/client";
export const adminRouter = Router();


adminRouter.post("/element",adminMiddleware, async (req, res) => {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid request data",
        });
    }
    try {
        const element = await client.element.create({
            data: {
                
                width: parsedData.data.width,
                height: parsedData.data.height,
                static: parsedData.data.static,
                imageUrl: parsedData.data.imageUrl,
            },
        });
        res.status(201).json({
            message: "Element created successfully",
            id: element.id,
        });
    }catch (error) {
        console.error("Error creating element:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
    res.status(501).json({
        message: "Admin element creation not implemented yet",
    });
});
adminRouter.put("/element/:elementId",adminMiddleware, async (req, res) => {
        
    const elementId = req.params.elementId;
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid request data",
        });
    }
    try {
        const element = await client.element.update({
            where: {
                id: elementId,
            },
            data: {
                imageUrl: parsedData.data.imageUrl,
            },
        });
        res.status(200).json({
            message: "Element updated successfully",
            id: element.id
        });
    } catch (error) {
        console.error("Error updating element:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
});
}
});
adminRouter.post("/avatar", async (req, res) => {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid request data",
        });
    }
    try {
        const avatar = await client.avatar.create({
            data: {
                imageUrl: parsedData.data.imageUrl,
                name: parsedData.data.name,
            },
        });
        res.status(201).json({
            message: "Avatar created successfully",
            id: avatar.id,
        });
    } catch (error) {
        console.error("Error creating avatar:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});      
adminRouter.post("/map",adminMiddleware, async (req, res) => {
        const parsedData = CreateMapSchema.safeParse(req.body);
        if(!parsedData.success) {
            return res.status(400).json({
                message: "Invalid request data",
            });
        }
        try {
            const map = await client.map.create({
                data: {
                    name: parsedData.data.name,
                    width: parseInt(parsedData.data.dimensions.split("x")[0]),
                    height: parseInt(parsedData.data.dimensions.split("x")[1]),
                    thumbnail: parsedData.data.thumbnail,
                    mapElements:{
                        create: parsedData.data.defaultElementId.map((element) => ({
                            elementId: element.elemenId,
                            x: element.x,
                            y: element.y,
                        })),
                    }
                },
            });
            res.status(201).json({
                message: "Map created successfully",
                id: map.id,
            });
        }  
        catch(error) {
            console.error("Error creating map:", error);
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
});