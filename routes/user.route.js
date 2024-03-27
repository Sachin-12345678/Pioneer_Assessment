const express=require("express")
const UserModel=require("../models/user.model")
const userRouter=express.Router();
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const blacklist=require("../models/blacklist")

//user register here--->
userRouter.post("/register",async(req,res)=>{
    const {username,email,password}=req.body
    try{
        const userpresent=await UserModel.findOne({email})
        if(userpresent){
            res.send("User Already Present Please Login")
        }
        bcrypt.hash(password,5,async(err, hash)=> {
            if(err) res.send({"msg":"Something went wrong","error":err.message})
            else{
                const user=new UserModel({username,email,password:hash})
                await user.save()
                res.send({"msg":"New Users has been registred"})
           }
        });
       
    }catch(err){
        res.send({"msg":"Something went wrong","error":err.message})
    }
    
})

//user login here--->
userRouter.post("/login", async(req,res)=>{
    const {email,password}=(req.body)
    try{
        const user=await UserModel.find({email})
        console.log(user);
        if(!user){
            res.send("wrong credential..")
        }
        bcrypt.compare(password, user[0].password,(err, result)=>{
            if(result){
                let token=jwt.sign({userID:user[0]._id},"masai")
                res.send({"msg":"Logged in","token":token})
            }else{
                res.send({"msg":"wrong inform"})
            }
        });
     }catch(err){
         res.send({"msg":"Something went wrong","error":err.message})
     }
})


//user logout here--->
userRouter.get("/logout",(req,res)=>{
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).send({error: "No token provided"});
    }
    blacklist.push(token)
    
    res.send({msg: "Logout successful"});
})


module.exports=userRouter;
