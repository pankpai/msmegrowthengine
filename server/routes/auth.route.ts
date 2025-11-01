import { Router } from "express";
import { signUp, signIn, refreshAccessToken, handleGetuserInfo, signOut, updateServiceshandler, handleGetMultipleUserInfo } from "../controller/authentication.controller";
import { authenticateUser } from "../middleware/middleware";

const router:Router = Router();

router.route('/sign-up').post(signUp)
router.route('/sign-in').post(signIn)
router.route('/user-info').get(authenticateUser,handleGetuserInfo)
router.route('/refresh-token').post(refreshAccessToken)
// router.route('/update-credit').post(updateCreditofUser)
router.route('/update-service').post(authenticateUser,updateServiceshandler)
router.route('/get-user-info').post(handleGetMultipleUserInfo)
router.route('/logout').post(signOut)

export default router;