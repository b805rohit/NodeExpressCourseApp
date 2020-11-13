import fs from 'fs'
import mongoose from 'mongoose'
import Bootcamp from './models/Bootcamps.js'
import Courses from './models/Courses.js'
import dotenv from 'dotenv'
import Users from './models/Users.js'

//init dotenv config
dotenv.config({path:'./config/config.env'})

//initialize mongoose
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})


//Read Bootcamp JSON
const bootcampsData=JSON.parse(fs.readFileSync(`./_data/bootcamps.json`,'utf-8'))
const coursesData=JSON.parse(fs.readFileSync(`./_data/courses.json`,'utf-8'))
const usersData=JSON.parse(fs.readFileSync(`./_data/users.json`,'utf-8'))


//Import the Data

const createBootcamp=async ()=>{
    try{
        await Bootcamp.create(bootcampsData)
        await Courses.create(coursesData)
        await Users.create(usersData)
        console.log('Bootcamp Data Inserted....')
        process.exit()
    }
    catch(error){
        console.log("Error Creating Data:",error)
    }
}

const deleteBootcamp=async ()=>{
    try{
        await Bootcamp.deleteMany()
        await Courses.deleteMany()
        await Users.deleteMany()

        console.log('Bootcamp Data Deleted!....')
        process.exit()
    }
    catch(error){
        console.log("Error Deleting Data:",error)
    }
}

if(process.argv[2]==='-i'){
    createBootcamp()
}
else if(process.argv[2]==='-d'){
    deleteBootcamp()
}

