import express from 'express';
const adminRouter = express.Router();
import { authAdmin,logoutAdmin,addProject,editProject,listProject,deleteProject,addPm,listPms,deletePm,  authorisePm,addSe,listSes,deleteSe, authoriseSe
     } from '../controllers/adminController.js';
import { adminProtect, pmProtect, protect, seProtect } from '../middleware/authMiddleware.js';
import {
     blockPmMiddleware,
     unblockPmMiddleware,
     blockSeMiddleware,
     unblockSeMiddleware,
   } from '../middleware/blockMiddleware.js';
  
import { photoUpload } from '../middleware/multerMiddleware.js';
import ImageKit from "imagekit";


// const adminPhotoStorage = multer.memoryStorage({
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now();
//       cb(null, `${uniqueSuffix}-${file.originalname}`);
//     },
//   });
  
//   const adminPhotoUpload = multer({ storage: adminPhotoStorage });


adminRouter.post('/adminauth',authAdmin);
adminRouter.post('/adminlogout',logoutAdmin);
adminRouter.post('/adminaddproject',addProject);
adminRouter.put('/admineditproject',editProject);

adminRouter.get('/adminlistproject',listProject);
adminRouter.delete('/admindeleteproject/:id',deleteProject);
adminRouter.post('/adminaddpm',photoUpload.single('pmPhoto'),addPm);

adminRouter.get('/adminlistpm',listPms);
adminRouter.delete('/admindeletepm/:id',deletePm)
adminRouter.patch('/adminblockpm/:id',blockPmMiddleware)
adminRouter.patch('/adminunblockpm/:id',unblockPmMiddleware)
adminRouter.patch('/adminauthorisepm/:id',authorisePm)

adminRouter.post('/adminaddse',photoUpload.single('sePhoto'),addSe);
adminRouter.get('/adminlistse',listSes);
adminRouter.delete('/admindeletese/:id',deleteSe)
adminRouter.patch('/adminblockse/:id',blockSeMiddleware)
adminRouter.patch('/adminunblockse/:id',unblockSeMiddleware)
adminRouter.patch('/adminauthorisese/:id',authoriseSe)



export default adminRouter;