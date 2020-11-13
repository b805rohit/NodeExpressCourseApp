import Users from "../models/Users.js"
import ErrorResponse from '../utils/errorResponse.js'
import AsyncHandler from '../middleware/asyncHandler.js'

//@Desc Registration
//@route /api/v1/auth/register
//@access Public
export const userRegistration=AsyncHandler(async(req,res,next)=>{
    const {name,email,role,password}=req.body
    const user=await Users.create({
        name,
        email,
        role,
        password 
    })

    sendToken(user,200,res)
})

//@Desc Login
//@route /api/v1/auth/login
//@access Public
export const userLogin=AsyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new ErrorResponse('Please provide email and password',400))
    }
    const user=await Users.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorResponse('Unauthorized Users',401))
    }

    const matchResult=await user.matchPassword(password)

    if(!matchResult){
        return next(new ErrorResponse("Password Does'nt Match",401))
    }

    sendToken(user,200,res)
})

//Send Token
const sendToken=function(user,statusCode,res){
    //Call Method to Get Token
    const token=user.getSignJwtToken()
    const options={
        expires:new Date(Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production'){
        options.secure=true
    }
    res
        .status(statusCode)
        .cookie('token',token,options)
        .json({success:true,token})
}