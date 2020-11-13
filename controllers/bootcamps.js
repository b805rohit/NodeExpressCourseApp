import Bootcamp from "../models/Bootcamps.js"
import ErrorResponse from '../utils/errorResponse.js'
import AsyncHandler from '../middleware/asyncHandler.js'
import path from 'path'

//Create New Bootcamp
export const createBootcamp=AsyncHandler(async(req,res,next)=>{
    req.body.user=req.user.id
    const publishedBootcamp= await Bootcamp.findOne({user:req.user.id})
    if(publishedBootcamp && req.user.role !=='admin'){
        return next(new ErrorResponse(`The user With Id ${req.user.id} is already published.`,403))
    }
    const data=await Bootcamp.create(req.body)
    res.status(201).json({success:true,data:data})
})

export const getAllBootcamps=AsyncHandler(async(req,res)=>{
    res.status(200).json(res.advanceResult)
})

export const getBootcamp=AsyncHandler(async(req,res,next)=>{
        const data=await Bootcamp.findById(req.params.id)
        if(!data){
            next(new ErrorResponse(`Bootcamp Not Found With Id ${error.value}`,404))
        }
        res.status(200).json({success:true,data})
    })

export const updateBootcamp=AsyncHandler(async(req,res,next)=>{
        const data=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!data){
            next(new ErrorResponse(`Bootcamp Not Found With Id ${error.value}`,404))
        }
        res.status(200).json({success:true,data})
})

export const deleteBootcamp=AsyncHandler(async(req,res,next)=>{
        const data=await Bootcamp.findByIdAndDelete(req.params.id)
        if(!data){
            return next(new ErrorResponse(`Bootcamp Not Found With Id ${error.value}`,404))
        }
        data.remove()

        res.status(200).json({success:true,data})
})

export const bootcampPhotoUpload=AsyncHandler(async(req,res,next)=>{
    const data=await Bootcamp.findById(req.params.id)
    if(!data){
        return next(new ErrorResponse(`Bootcamp Not Found With Id ${error.value}`,404))
    }

    if(!req.files){
        return next(new ErrorResponse(`Please Upload a file`,400))
    }   
    const {file}=req.files
    //Make Sure Image is Photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please Upload an Image file`,400))
    }
    //Check File Size
    if(file.size>process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please Upload an Image less than ${process.env.MAX_FILE_UPLOAD}`,400))
    }

    //Create Custom File Name
    file.name=`photo_${data._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
        if(err){
            console.error(err)
            return next(new ErrorResponse(`Problem with File upload`,500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
        res.status(200).json({
            success:true,
            data:file.name
        })
    })
})