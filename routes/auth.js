import {userRegistration,userLogin} from '../controllers/auth.js'
import { Router } from "express"

const router=Router()

//@Desc Registration
//@route /api/v1/auth/register
//@access Public

router.post('/register',userRegistration)

router.get('/login',userLogin)

export default router