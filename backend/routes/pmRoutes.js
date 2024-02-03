import express from 'express';
const pmRouter = express.Router();
import { authPm,
  pmgoogleAuth,
    registerPm,
    logoutPm,
    getPmProfile,
    updatePmProfile,
  dashPm,
addTeam, listTeam,
deleteTeam, 
uploadDocument, listDocument, listMaterialRequest, requestPermit, requestReject,getUserPm } from '../controllers/pmController.js';
import { pmProtect } from '../middleware/authMiddleware.js';
import { photoUpload,pdfUpload } from '../middleware/multerMiddleware.js';
import ImageKit from "imagekit";
import { materialRequest } from '../controllers/userController.js';


// const pmPhotoStorage = multer.memoryStorage({
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now();
//       cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
//   });
  
//   const pmPhotoUpload = multer({ storage: pmPhotoStorage });

pmRouter.post('/pmregister',registerPm);
pmRouter.post('/pmauth',authPm);
pmRouter.post('/pmgauth',pmgoogleAuth);
pmRouter.post('/pmdash',dashPm);
pmRouter.get('/pmrequest',listMaterialRequest);
pmRouter.patch('/requestpermit/:id',requestPermit);
pmRouter.patch('/requestreject/:id',requestReject);
pmRouter.post('/pmteam',addTeam);
pmRouter.put('/pmdocument/:projectId',pdfUpload.single("pmfile"),uploadDocument);
// pmRouter.delete('/deletedocument/:id',deleteDocument);
pmRouter.get('/listdocument',listDocument)
pmRouter.get('/listteam',listTeam);
pmRouter.delete('/deleteteam/:id',deleteTeam);
pmRouter.post('/pmlogout',logoutPm);
pmRouter.route('/pmprofile').get(pmProtect,getPmProfile).put(pmProtect,photoUpload.single("pmPhoto"),updatePmProfile)
pmRouter.get('/getuserpm/:id',getUserPm)

export default pmRouter;