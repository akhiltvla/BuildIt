import express from 'express';
const router = express.Router();
import { authUser,
    registerUser,
    resetPassword,
    logoutUser,
  
    sendPasswordLink,
    getUserProfile,
    updateUserProfile,
  dashUser, listTeamSe, materialRequest,employeeRequest, equipmentRequest,listMaterialRequest,seLocation,googleAuth, getUser } from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import { photoUpload } from '../middleware/multerMiddleware.js';
import ImageKit from "imagekit";



// const userPhotoStorage = multer.memoryStorage({
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now();
//       cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
//   });
  
//   const userPhotoUpload = multer({ storage: userPhotoStorage });

router.post('/',registerUser);
router.post('/auth',authUser);
router.post('/gauth',googleAuth);
router.post('/logout',logoutUser);

router.post('/seforgotpassword',sendPasswordLink)
router.post('/seresetpassword/:_id/:token',resetPassword)
router.route('/profile').get(protect,getUserProfile).put(protect,photoUpload.single("sePhoto"),updateUserProfile)
router.get('/dash',dashUser)
router.get('/getuser/:id',getUser)
// router.get('/userpmchats/:id',userpmChats)
// router.get('/getmessage/:id',getMessage)
// router.get('/seteam',listTeamSe)
router.get('/listteamse',listTeamSe);
router.get('/request',listMaterialRequest);
router.post('/materialrequest',materialRequest)

router.post('/employeerequest',employeeRequest)
router.post('/equipmentrequest',equipmentRequest)
router.post('/selocation',seLocation)
export default router;