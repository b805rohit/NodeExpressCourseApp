import asyncHandler from './asyncHandler.js'
import User from '../models/Users.js'
import ErrorResponse from '../utils/errorResponse.js'
import jwt from 'jsonwebtoken'

export const protect=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new ErrorResponse('UnAuthorized User To access route',401))
    }
    //Verify The Token
    try{
        const decode=await jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decode.id)

        next()
    }
    catch(error){
        return next(new ErrorResponse('Authorized User To access route',401))
    }
})

export const authorizedRole=(...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`User Role has Unauthorized ${req.user._id}`,403))
    }
    next()
}