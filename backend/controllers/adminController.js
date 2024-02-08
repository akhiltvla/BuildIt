import asyncHandler from 'express-async-handler';
import { generateAdminToken } from '../utils/generateToken.js';
import Admin from '../models/adminModel.js'; 
import dotenv from 'dotenv'
dotenv.config()
import Pm from '../models/pmModel.js';
import User from '../models/userModel.js'
import Project from '../models/projectModel.js';


// const saveAdminData = asyncHandler(async (email, password) => {

//   try {
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return;
//     } else {
//       const admin = await Admin.create({
//         email: email,
//         password: password,
//       });
//     }
//   } catch (error) {
//     console.error("Error saving admin data:", error);
//     throw new Error("Unable to save admin data");
//   }
// });

// saveAdminData(process.env.predefinedEmail, process.env.predefinedPassword)



const authAdmin = asyncHandler(async (req, res) => {
    // For testing purposes, provide predefined email and password


    const { email, password } = req.body;


    const admin = await Admin.findOne({ email });

    if (admin && await admin.matchPassword(password)) {


        // In a real scenario, query the database to check if the admin exists

        generateAdminToken(res, admin._id);
        res.status(201).json({
            _id: admin._id,

            email: admin.email,
            
        });

    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const logoutAdmin = asyncHandler(async (req, res) => {
    // Clear the admin token or session as needed
    res.cookie('adminjwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Admin logged out' });
});

//.........................Project..............................//

const addProject = asyncHandler(async (req, res) => {
    // Retrieve data from the request body
    const { pname, pplace, pclient, ppm, pse, sdate, edate } = req.body;

    // Validation or any necessary checks before adding the PM
    if (!pname || !pplace || !pclient || !ppm || !pse || !sdate || !edate) {

        res.status(400);
        throw new Error('Please provide all required fields.');

    }

    try {
        // Check if the Project already exists
        const existingProject = await Project.findOne({ pname });
        if (existingProject) {
            res.status(400).json({ message: 'Project already exists' }); // Sending error response when PM exists
        } else {


            // Create the new Project
            const newProject = await Project.create({
                name: pname,
                place: pplace,
                client: pclient,
                pm: ppm,
                se: pse,
                sdate: sdate,
                edate: edate,
            });

            if (newProject) {
                res.status(201).json({
                    _id: newProject._id,

                    pname: newProject.pname,
                    pplace: newProject.pplace,
                    pclient: newProject.pclient,
                    ppm: newProject.ppm,
                    pse: newProject.pse,
                    psdate: newProject.sdate,
                    pedate: newProject.edate,

                });
            } else {
                res.status(400);
                throw new Error('Failed to create Project.');
            }
        }

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});




const editProject = asyncHandler(async (req, res) => {
    // Retrieve data from the request body
    const { _id,pname, pplace, pclient, ppm, pse, sdate, edate } = req.body;
      
    // Validation or any necessary checks before adding the PM
    if (!pname || !pplace || !pclient || !ppm || !pse || !sdate || !edate) {

        res.status(400);
        throw new Error('Please provide all required fields.');

    }

    try {
        // Check if the Project already exists
        const existingProject = await Project.findOne({ _id  });
        if (!existingProject) {
            res.status(400).json({ message: 'Project Not found' }); // Sending error response when PM exists
        } else {
            
            // Create the new Project
            existingProject.name = pname;
            existingProject.place = pplace;
            existingProject.client = pclient;
            existingProject.pm = ppm;
            existingProject.se = pse;
            existingProject.sdate = sdate;
            existingProject.edate = edate;
            
            // Save the updated project
            const updatedProject = await existingProject.save();
            
            res.status(200).json({
                _id: updatedProject._id,
                pname: updatedProject.name,
                pplace: updatedProject.place,
                pclient: updatedProject.client,
                ppm: updatedProject.pm,
                pse: updatedProject.se,
                psdate: updatedProject.sdate,
                pedate: updatedProject.edate,
            });
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});



const listProject = asyncHandler(async (req, res) => {
    try {
        const project = await Project.find(); // Retrieve all project managers
        if (project) {
            res.status(200).json(project); // Respond with the list of project managers
        } else {
            res.status(404);
            throw new Error('No Project found');
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});


// Controller to delete a project by ID
const deleteProject = async (req, res) => {
    const projectId = req.params.id; // Get the project ID from the request parameters
    console.log('Received Project ID:', projectId);
    try {
        // Find the project by ID and delete it
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found or already deleted' });
        }

        res.status(200).json({ message: 'Project deleted successfully', deletedProject });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete the project', error: error.message });
    }
};






//............................Project Mananger........................//

const addPm = asyncHandler(async (req, res) => {
    // Retrieve data from the request body
    const { pmname, pmcontact, pmemail, pmpassword, jdate } = req.body;

    console.log(req.body);
    // Validation or any necessary checks before adding the PM
    if (!pmname || !pmcontact || !pmemail || !pmpassword || !jdate) {
        res.status(400);
        throw new Error('Please provide all required fields.');

    }

    try {
        // Check if the PM already exists
        const existingPM = await Pm.findOne({ pmemail });
        if (existingPM) {
            res.status(400).json({ message: 'PM already exists' }); // Sending error response when PM exists
        } else {
            console.log('Project Manager already exists.');

            // Create the new PM
            const newPM = await Pm.create({
                name: pmname,
                contact: pmcontact,
                email: pmemail,
                password: pmpassword,
                jdate
            });
            // console.log(newPM);
            if (newPM) {
                res.status(201).json({
                    _id: newPM._id,

                    pmname: newPM.pmname,
                    pmcontact: newPM.pmcontact,
                    pmemail: newPM.pmemail,
                    pmpassword: newPM.pmpassword,
                    jdate: newPM.jdate
                });
            } else {
                res.status(400);
                throw new Error('Failed to create Project Manager.');
            }
        }

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});


const listPms = asyncHandler(async (req, res) => {
    try {
        const projectManagers = await Pm.find(); // Retrieve all project managers
        if (projectManagers) {
            res.status(200).json(projectManagers); // Respond with the list of project managers
        } else {
            res.status(404);
            throw new Error('No Project Managers found.');
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const deletePm = asyncHandler(async (req, res) => {
    const pmId = req.params.id;
    try {
        const deletedPm = await Pm.findByIdAndDelete(pmId)
        if (!deletedPm) {
            return res.status(404).json({ message: 'User not found or already deleted' })
        }
        res.status(200).json({ message: 'User deleted successfully', deletedPm })
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete the User', error: error.message })
    }
})







const authorisePm = asyncHandler(async (req, res) => {
    const pmId = req.params.id

    try {
        const pm = await Pm.findById(pmId)

        if (!pm) {
            return res.status(404).json({ message: 'User not found' });
        }
        else {

            pm.isauthorise = true
            await pm.save()

            res.status(200).json({ message: 'User Authorised successfully' });
        }
    } catch (error) {
        console.error('Error authorising user:', error);
        res.status(500).json({ message: 'Failed to authorise the user' });
    }
}
)











//....................................Site Engineer.......................................//

const addSe = asyncHandler(async (req, res) => {
    // Retrieve data from the request body
    const { sename, secontact, seemail, sepassword, jdate } = req.body;


    // Validation or any necessary checks before adding the PM
    if (!sename || !secontact || !seemail || !sepassword || !jdate) {
        res.status(400);
        throw new Error('Please provide all required fields.');

    }

    try {
        // Check if the PM already exists
        const existingSE = await User.findOne({ seemail });
        if (existingSE) {
            res.status(400).json({ message: 'SE already exists' }); // Sending error response when PM exists
        } else {
            console.log('Site Engineer already exists.');

            // Create the new PM
            const newSE = await User.create({
                name: sename,
                contact: secontact,
                email: seemail,
                password: sepassword,
                jdate
            });
            console.log(newSE);
            if (newSE) {
                res.status(201).json({
                    _id: newSE._id,

                    sename: newSE.sename,
                    secontact: newSE.secontact,
                    seemail: newSE.seemail,
                    sepassword: newSE.sepassword,
                    jdate: newSE.jdate
                });
            } else {
                res.status(400);
                throw new Error('Failed to create SE.');
            }
        }

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});


const listSes = asyncHandler(async (req, res) => {
    try {

        const siteEngineers = await User.find(); // Retrieve all site engineers
        if (siteEngineers) {
            res.status(200).json(siteEngineers); // Respond with the list of site engineers
        } else {
            res.status(404);
            throw new Error('No Site Engineers found.');
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const deleteSe = asyncHandler(async (req, res) => {
    const seId = req.params.id
    console.log('Received Project ID:', seId);
    try {
        const deletedSe = await User.findByIdAndDelete(seId)
        if (!deletedSe) {
            return res.status(404).json({ message: 'User not found or already deleted' })
        }
        res.status(200).json({ message: 'User deleted successfully', deletedSe })
    } catch (error) {
        res.status(500).json({ message: 'Failed todelete the User', error: error.message })
    }
})



const authoriseSe = asyncHandler(async (req, res) => {
    const seId = req.params.id

    try {
        const se = await User.findById(seId)

        if (!se) {
            return res.status(404).json({ message: 'User not found' });
        }
        else {

            se.isauthorise = true
            await se.save()

            res.status(200).json({ message: 'User Authorised successfully' });
        }
    } catch (error) {
        console.error('Error authorising user:', error);
        res.status(500).json({ message: 'Failed to authorise the user' });
    }
}
)


export { authAdmin, logoutAdmin, addProject,editProject, listProject, deleteProject, addPm, deletePm, authorisePm, addSe, listPms, listSes, deleteSe, authoriseSe };



