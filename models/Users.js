import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Add A Name']
    },
    email: {
        type: String,
        required:[true,'Please add an email'],
        unique:true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
    },
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false,
    },
    resetPasswordToken:String,
    resetPasswordExpiration:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    },
})

//Encrypt Password
userSchema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
//Sign JWT And Return
userSchema.methods.getSignJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}
//Match Password
userSchema.methods.matchPassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}

export default mongoose.model('User',userSchema)