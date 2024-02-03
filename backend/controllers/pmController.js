import asyncHandler from 'express-async-handler'
import { generatePmToken } from '../utils/generateToken.js';
import Pm from "../models/pmModel.js"
import User from '../models/userModel.js';
import Team from '../models/teamModel.js'
import Project from '../models/projectModel.js';
import Request from '../models/requestModel.js';
import { photoUpload,pdfUpload } from '../middleware/multerMiddleware.js';
import ImageKit from "imagekit";

const authPm = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const pm = await Pm.findOne({ email })

    if (pm && (await pm.matchPassword(password)) && pm.isauthorise && !pm.isblocked) {

        generatePmToken(res, pm._id)
        res.status(201).json({
            _id: pm._id,
            name: pm.name,
            email: pm.email,
            contact: pm.contact,
            jdate: pm.jdate,
            photo: pm.photo
        })
    } else if (pm && !pm.isauthorise) {
        res.status(401)
        throw new Error('Waiting for authorisation')
    } else if (pm && pm.isblocked) {
        res.status(401)
        throw new Error('Blocked account')
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
});


const pmgoogleAuth = asyncHandler(async (req, res) => {
    const { name,email,picture } = req.body;
    console.log('abcd',name,email,picture);
  
    const existingUser = await Pm.findOne({ email })
  
  if(existingUser){
    if(!existingUser.isblocked){
      if(existingUser.isauthorise){
        generateToken(res, existingUser._id) 
        res.status(200).json({
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          photo: existingUser.photo
  
      })
  
      }
      else{
        res.status(401)
        throw new Error('Pm is not authorised by admin')
      }
    }else{
      res.status(401)
      throw new Error('Pm is Blocked by admin')
    }
  
  }else{
    const newUser= await Pm.create({
      name,
      email,
      picture
  });
  res.status(400)
          throw new Error('Created, Waiting for authorisation')
  
    
  }
  
  });

const registerPm = asyncHandler(async (req, res) => {

    const { name, email, password,contact, jdate, photo } = req.body;

    const pmExist = await Pm.findOne({ email })

    if (pmExist) {
        res.status(400);
        throw new Error('User already exists')
    }

    const pm = await Pm.create({
        name,
        email,
        password,
        contact,
        jdate,
        photo
    });
    
    if (pm) {

        generatePmToken(res, pm._id)
        res.status(201).json({
            _id: pm._id,
            name: pm.name,
            email: pm.email
        })
    } else {

        res.status(400)
        throw new Error('Invalid user data')
    }
});

const logoutPm = asyncHandler(async (req, res) => {
    res.cookie('pmjwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User logged out' })
});

const getPmProfile = asyncHandler(async (req, res) => {
    const pm = {
        _id: req.pm._id,
        name: req.pm.name,
        email: req.pm.email,
        contact: req.pm.contact,
        jdate: req.pm.jdate
    }
    res.status(200).json({ pm })
});

const updatePmProfile = asyncHandler(async (req, res) => {
    const pm = await Pm.findById(req.pm._id)
    if (pm) {
        pm.name = req.body.name || pm.name
        pm.email = req.body.email || pm.email
        pm.contact = req.body.contact || pm.contact
        pm.jdate = req.body.jdate || pm.jdate

        if (req.body.password) {
            pm.password = req.body.password
        }

        if (req.file) {
            // SDK initialization



            const imagekit = new ImageKit({
                publicKey: "public_901aH+g9LoQbqF65UAnxNoUvUKo=",
                privateKey: "private_yGRcW3VJjmAtOKQ5m0/24lksT5M=",
                urlEndpoint: "https://ik.imagekit.io/s3gmlmxc5"
            });

            //uploading image to CDN(imageKit)
            const uploadImage = () => {
                return new Promise((resolve, reject) => {
                    imagekit.upload(
                        {
                            file: req.file.buffer,
                            fileName: `${Date.now()}-${req.file.originalname}`,
                        },
                        (error, result) => {
                            if (error) {
                                console.log("Error uploading image to imagekit", error);
                                reject(error);
                            } else {
                                resolve(result.url);
                            }
                        }
                    );
                });
            };

            try {
                const imageUrl = await uploadImage();

                pm.photo = imageUrl;
            } catch (error) {
                res.status(500).json({ error: "Image upload failed" });
                return;
            }


        }

        const updatePm = await pm.save()

        res.status(200).json({
            _id: updatePm._id,
            name: updatePm.name,
            email: updatePm.email,
            contact: updatePm.contact,
            jdate: updatePm.jdate,
            photo: updatePm.photo
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
});


const dashPm = asyncHandler(async (req, res) => {
    const pm = {
        _id: req.pm._id,
        name: req.pm.name,
        email: req.pm.email
    }
    res.status(200).json({ message: 'User dahboard is here' })
});

const uploadDocument = async (req, res) => {
    try {
      // Get the project ID from request parameters
      const projectId = req.params.projectId;
//   console.log('projectId:',projectId);
      // Find the project by ID
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      if (req.file) {
        // SDK initialization



        const imagekit = new ImageKit({
            publicKey: "public_901aH+g9LoQbqF65UAnxNoUvUKo=",
            privateKey: "private_yGRcW3VJjmAtOKQ5m0/24lksT5M=",
            urlEndpoint: "https://ik.imagekit.io/s3gmlmxc5"
        });

        //uploading image to CDN(imageKit)
        const uploadFile = () => {
            return new Promise((resolve, reject) => {
                imagekit.upload(
                    {
                        file: req.file.buffer,
                        fileName: `${Date.now()}-${req.file.originalname}`,
                    },
                    (error, result) => {
                        if (error) {
                            console.log("Error uploading image to imagekit", error);
                            reject(error);
                        } else {
                            resolve(result.url);
                        }
                    }
                );
            });
        };

        try {
            const imageUrl = await uploadFile();
                //console.log(imageUrl);
            project.pdf.push(imageUrl);
            await project.save()
           
        } catch (error) {
            res.status(500).json({ error: "Image upload failed" });
            return;
        }
        res.status(200).json("Image upload ");

    }
  
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

//   const deleteDocument = async (req, res) => {
//     const projectId = req.params.id; // Get the project ID from the request parameters
//     const documentId = req.params.documentId; // Get the document ID from the request parameters

//     console.log('Received Project ID:', projectId);
//     console.log('Received Document ID:', documentId);

//     try {
//         // Assuming you have a Document model associated with the Project
//         // Replace 'Document' with your actual model name
//         const deletedDocument = await Document.findByIdAndDelete(documentId);

//         if (!deletedDocument) {
//             return res.status(404).json({ message: 'Document not found or already deleted' });
//         }

//         // If the document is successfully deleted, you might also want to update the Project
//         // Assuming there is a 'documents' field in the Project model containing document IDs
//         const updatedProject = await Project.findByIdAndUpdate(
//             projectId,
//             { $pull: { documents: documentId } }, // Remove the document ID from the array
//             { new: true } // Return the updated project
//         );

//         res.status(200).json({
//             message: 'Document deleted successfully',
//             deletedDocument,
//             updatedProject,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to delete the document', error: error.message });
//     }
// };


  const listDocument = asyncHandler(async (req, res) => {
    try {
        const projectId = req.query.projectId;
         console.log('recievedproject id:', projectId);
        const project = await Project.findById(projectId); // Retrieve all project managers
         //console.log('Projt:',project);
        if (project && project.pdf) {
            const pdfLink = project.pdf
            // console.log('pdflink:::',pdfLink);
            res.status(200).json({ document: pdfLink }); // Respond with the PDF link
        } else {
            res.status(404).json({ message: 'No Document found' });
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// ......................Team...................................//

const addTeam = asyncHandler(async (req, res) => {
    // Retrieve data from the request body
    const { tname, trole, tcontact, temail, pmId, projectId } = req.body;

   
    // Validation or any necessary checks before adding the PM
    if (!tname || !trole || !tcontact || !temail) {
        res.status(400);
        throw new Error('Please provide all required fields.');

    }

    try {
        // Check if the Project already exists
        const existingTeam = await Team.findOne({ name: tname });

        if (existingTeam) {
            res.status(400).json({ message: 'Member already exists' }); // Sending error response when PM exists
        } else {

            
            // Create the new Project
            const newTeam = await Team.create({
                pmId,
                projectId,
                name: tname,
                role: trole,
                contact: tcontact,
                email: temail,

            });

            if (newTeam) {

                res.status(201).json({
                    _id: newTeam._id,

                    name: newTeam.name,
                    role: newTeam.role,
                    contact: newTeam.contact,
                    email: newTeam.email,


                });
            } else {
                res.status(400);
                throw new Error('Failed to create Team.');
            }
        }

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})



const listTeam = asyncHandler(async (req, res) => {
    try {
        const projectId = req.query.projectId;
        // console.log('recievedproject id:', projectId);
        const team = await Team.find({ projectId }); // Retrieve all project managers
        // console.log('Team:',team);
        if (team) {
            res.status(200).json(team); // Respond with the list of project managers
        } else {
            res.status(404).json({ message: 'No Team found' });
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const deleteTeam = async (req, res) => {
  
    const teamId = req.params.id; // Get the project ID from the request parameters
    
    try {
        // Find the project by ID and delete it
        const deletedTeam = await Team.findByIdAndDelete(teamId);

        if (!deletedTeam) {
            return res.status(404).json({ message: 'Team not found or already deleted' });
        }

        res.status(200).json({ message: 'Team deleted successfully', deletedTeam });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the project', error: error.message });
    }
};
// .........................requests.........................................



const listMaterialRequest = asyncHandler(async (req, res) => {
    try {
        const projectId = req.query.projectId;
        // console.log('recievedproject id:', projectId);
        const request = await Request.find({ projectId }); // Retrieve all project managers
        // console.log('Team:',team);
        if (request) {
            res.status(200).json(request); // Respond with the list of project managers
        } else {
            res.status(404).json({ message: 'No Team found' });
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});


const requestPermit = asyncHandler(async(req,res)=>{
    const requestId = req.params.id

    try {
        const request = await Request.findById(requestId)
        
        if(!request){
            return res.status(404).json({ message: 'not found' });
        }
        else{
          
        request.ispermit = true
        await request.save()
        
        res.status(200).json({ message: 'Permitted successfully' });
        }
    } catch (error) {
        console.error('Error permitting:', error);
        res.status(500).json({ message: 'Failed to permit' });
  }
    }
)



const requestReject = asyncHandler(async(req,res)=>{
    const requestId = req.params.id

    try {
        const request = await Request.findById(requestId)
        
        if(!request){
            return res.status(404).json({ message: 'not found' });
        }
        else{
          
        request.isreject = true
        await request.save()
        
        res.status(200).json({ message: 'Rejected successfully' });
        }
    } catch (error) {
        console.error('Error rejecting:', error);
        res.status(500).json({ message: 'Failed to reject' });
  }
    }
)

const getUserPm = asyncHandler(async(req,res)=>{
    const id= req.params.id
    // console.log('abcd',id);
  try {
    const user = await User.findById(id)
    if(user){
      res.status(200).json(user);
    }
    else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
  
  }
)

export {
    authPm,
    pmgoogleAuth,
    registerPm,
    logoutPm,
    getPmProfile,
    updatePmProfile,
    dashPm,
    addTeam,
    listTeam,
    deleteTeam,
    uploadDocument,
    listDocument,
    getUserPm,
    listMaterialRequest,
    requestPermit,
    requestReject
}