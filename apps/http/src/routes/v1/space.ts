import { Router } from "express";


export const spaceRouter = Router();

spaceRouter.post("/", (req,res)=>{
    const { name, description } = req.body;
    // Logic to create a new space with the provided name and description
    res.status(201).json({
        message: "Space created successfully",
        data: {
            name,
            description
        }
    });
})

spaceRouter.delete("/:spaceId", (req, res) => {
    const { spaceId } = req.params;
    // Logic to delete the space with the given spaceId
    res.status(200).json({
        message: `Space with ID ${spaceId} deleted successfully`
    });
});

spaceRouter.get("/all" ,(req, res)=>{
    res.status(200).json({
        message: "All spaces retrieved successfully",
        data: [] // Replace with actual data retrieval logic
    });
})

spaceRouter.get("/element", (req , res)=>{
    res.status(200).json({
        message: "Space elements retrieved successfully",
        data: [] // Replace with actual space element retrieval logic
    });
})

spaceRouter.get("/element", (req, res)=>{
    res.status(200).json({
        message: "Space element retrieved successfully",
        data: {} // Replace with actual space element retrieval logic   
    })
})

spaceRouter.get("/:spaceId", (req, res) => {
    const { spaceId } = req.params;
    // Logic to retrieve the space with the given spaceId
    res.status(200).json({
        message: `Space with ID ${spaceId} retrieved successfully`,
        data: {} // Replace with actual space data retrieval logic
    });
});