import express from 'express'
import bodyParser from 'body-parser'
import dotEnv from 'dotenv'
import morgan from 'morgan'
import connectDb from './config/db.js'
import bootcamps from './routes/bootcamps.js'
import courses from './routes/courses.js'
import auth from './routes/auth.js'
import errorHandler from './middleware/error.js'
import fileUpload from 'express-fileupload'
import path from 'path'
import cookieParser from 'cookie-parser'

dotEnv.config({path:'./config/config.env'})

//connect to Database
connectDb()

const app=express()
//Dev Logging MiddleWare

app.use(bodyParser.json())

app.use(cookieParser())

if(process.env.NODE_ENV==='Development'){
    app.use(morgan('dev'))
}

//File Upload
app.use(fileUpload())

//Static Folder
app.use(express.static(path.join('./','public')))

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth',auth)

app.use(errorHandler)


const server=app.listen(process.env.PORT,()=>{
    console.log(`Listening on Port ${process.env.PORT}`)
})

//catch Error

process.on('unhandledRejection',(err)=>{
    console.log("Error is:",err.message)

    server.close(()=> process.exit(1))
})