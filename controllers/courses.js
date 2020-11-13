import Courses from "../models/Courses.js"
import Bootcamp from "../models/Bootcamps.js"
import ErrorResponse from '../utils/errorResponse.js'
import AsyncHandler from '../middleware/asyncHandler.js'

//@Desc getAll Route
//@route /api/v1/bootcamp/:bootcampID/courses
//@route /api/v1/courses
//@access Public
export const getCourses=AsyncHandler(async (req,res)=>{
    if(req.params.bootcampId){
        let query=await Courses.find({bootcamp:req.params.bootcampId})
        return res.send(query).status(200)
    }
    return res.json(res.advanceResult).status(200)
})

//@Desc getSingleCourse
//@route /api/v1/courses/:id
//@access Public
export const getCourse=AsyncHandler(async (req,res,next)=>{
    const course=await Courses.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!course){
        return next(new ErrorResponse(`No Course Found With Id ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        count:course.length,
        data:course
    })
})


//@Desc AddCourse
//@route /api/v1/bootcamp/:bootcampId/course
//@access public

export const addCourse=AsyncHandler(async(req,res,next)=>{

    req.body.bootcamp=req.params.bootcampId
    const bootcamp=await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp Not Exist With Id ${req.params.bootcampId}`),404)
    }
    const Course=await Courses.create(req.body)

    res.json({
        success:true,
        Message:'Add Successfully',
        data:Course
    })
})

//@Desc updateCourse
//@route /api/v1/course/:id
//@access public

export const updateCourse=AsyncHandler(async(req,res,next)=>{
    const Course=await Courses.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!Course){
        return next(new ErrorResponse(`Course Not Exist With Id ${req.params.bootcampId}`),404)
    }

    res.json({
        success:true,
        Message:'Updated Successfully',
        data:Course
    })
})

//@Desc delete Course
//@route /api/v1/course/:id
//@access public

export const deleteCourse=AsyncHandler(async(req,res,next)=>{
    const Course=await Courses.findByIdAndUpdate(req.params.id)
    if(!Course){
        return next(new ErrorResponse(`Course Not Exist With Id ${req.params.bootcampId}`),404)
    }

    Course.remove()

    res.json({
        success:true,
        Message:'Deleted Successfully',
        data:{}
    })
})