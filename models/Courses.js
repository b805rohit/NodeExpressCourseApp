import mongoose from "mongoose"


const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
})

//Static Course Methods
CourseSchema.statics.getAggregate=async function (bootcampId){
  const obj=await this.aggregate([{
    '$match':{bootcamp:bootcampId},
  },
  {
    '$group':{
      _id:'$bootcamp',
      averageCost:{ $avg: '$tuition' }
    }
  }
])

  try{
    console.log(obj)
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
      averageCost:Math.ceil(obj[0].averageCost/10)*10
    })
  }
  catch(error){
    console.log("Aggerate Error is:",error)
  }

}

CourseSchema.post('save',function(){
  this.constructor.getAggregate(this.bootcamp)
})

CourseSchema.post('remove',function(){
  this.constructor.getAggregate(this.bootcamp)
})

export default mongoose.model('Course',CourseSchema)