import express from 'express'
import { createBootcamp,getAllBootcamps,getBootcamp,updateBootcamp,deleteBootcamp,bootcampPhotoUpload } from "../controllers/bootcamps.js" 
//Include Other Resource Router
import courses from './courses.js'
import { protect,authorizedRole } from '../middleware/auth.js'
import Bootcamp from '../models/Bootcamps.js'
import AdvanceMiddleware from '../middleware/advanceMiddleware.js'

const router=express.Router()

router.use('/:bootcampId/courses',courses)

router.route('/:id/photo').put(protect,authorizedRole('publisher','admin'),bootcampPhotoUpload)

router
  .route('/') 
  .get(AdvanceMiddleware(Bootcamp,{path:'courses',select:'title'}),getAllBootcamps)
  .post(protect,authorizedRole('publisher','admin'),createBootcamp);
  


router
    .route('/:id')
    .get(getBootcamp)
    .delete(protect,authorizedRole('publisher','admin'),deleteBootcamp)
    .post(protect,authorizedRole('publisher','admin'),updateBootcamp)


export default router;