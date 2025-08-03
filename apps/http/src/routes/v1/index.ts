import { Response, Router , Request} from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import client from "@repo/db/client";
export const router = Router();

router.post("/signup" , (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Logic to handle user signup
    res.status(201).json({
        message: "User signed up successfully",
        data: {
            username,
            password // In a real application, never return passwords in responses  
        }
    });
});

router.post("/signin" , (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Logic to handle user signin
    res.status(200).json({
        message: "User signed in successfully", 
        data: {
            username,
            // In a real application, never return passwords in responses
        }
    });
})


router.get("/elements" , (req:Request, res: Response)=>{

    res.status(200).json({
        message: "Elements retrieved successfully",
        data: [] // Replace with actual data retrieval logic
    });
})

router.get("/avatars",(req:Request, res:Response)=>{
    res.status(200).json({
        message: "Avatar retrieved successfully",
        data: {} // Replace with actual avatar data retrieval logic
    });
})
router.use("/user" , userRouter)

router.use("/admin" ,adminRouter)

router.use("/space" , spaceRouter)