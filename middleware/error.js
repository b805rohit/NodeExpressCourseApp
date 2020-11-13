import ErrorResponse from '../utils/errorResponse.js'

const errorHandler=(err,req,res,next)=>{
    //Error For Dev
    console.log(err.stack)
    let error={...err}

    if(err.name==='CastError'){
        const message=`Bootcamp Not Found With Id ${error.value}`
        error=new ErrorResponse(message,404)
    }

    res.status(error.statusCode || 400).json({
        success:false,
        message:err.message || 'Server Error'
    })

}

export default errorHandler
