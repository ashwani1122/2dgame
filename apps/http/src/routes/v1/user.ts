import { Router } from "express";


export const userRouter = Router();

userRouter.post("/metadata", (req, res)=>{

})

userRouter.get("/" , (req, res)=>{
    res.status(200).json({
        message: "User route is working"
    })
})