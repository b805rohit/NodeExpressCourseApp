import Mongoose from 'mongoose'

const connectDb=async ()=>{
    const conn=await Mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })

    console.log(`MongoDB Connected ${conn.connection.host} `)
}

export default connectDb