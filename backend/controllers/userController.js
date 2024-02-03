import asyncHandler from 'express-async-handler'
import {generateToken,generateSeforgotToken} from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Pm from '../models/pmModel.js'
import Team from '../models/teamModel.js';
import Request from '../models/requestModel.js';
// import Message from '../models/MessageModel.js';
import ImageKit from "imagekit";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })


    // if (user) {
    //     if (user.isblocked) {
    //         res.status(401);
    //         throw new Error('Your account is blocked. Please contact support for assistance.');
    //     }


    if (user && (await user.matchPassword(password)) && user.isauthorise && !user.isblocked) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            jdate: user.jdate,
            photo: user.photo

        })
    } else if(user && !user.isauthorise){
        res.status(401)
        throw new Error('Waiting for authorisation')
    } else if(user && user.isblocked){
        res.status(401)
        throw new Error('Blocked account')
    }else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
});

const googleAuth = asyncHandler(async (req, res) => {
  const { name,email,picture } = req.body;
  console.log('abcd',name,email,picture);

  const existingUser = await User.findOne({ email })

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
      throw new Error('User is not authorised by admin')
    }
  }else{
    res.status(401)
    throw new Error('User is Blocked by admin')
  }

}else{
  const newUser= await User.create({
    name,
    email,
    picture
});
res.status(400)
        throw new Error('Created, Waiting for authorisation')

  
}

});



const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, contact, jdate, photo } = req.body;

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400);
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password,
        contact,
        jdate,
        photo
    });

    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User logged out' })
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        contact: req.user.contact,
        jdate: req.user.jdate
    }
    res.status(200).json({ user })
});


// const verifyUser = asyncHandler(async(req,res)=>{
//   const{id,token} = req.params;
//   try {
//     const validuser = await User.findOne({_id:id,verifytoken:token})

//     const verifyToken = jwt.verify(token,keysecret)

//     if(validuser && verifyToken.id){
//       res.status(201).json({status:201,validuser})
//     }else{
//       res.status(401).json({status:401,message:'user not exist'})
//     }
//   } catch (error) {
//     res.status(401).json({status:401,error})
//   }
// })

const sendPasswordLink =asyncHandler(async(req,res)=>{
  console.log(req.body)

  const {email} = req.body;

  if(!email){
      res.status(401).json({status:401,message:"Enter Your Email"})
  }

  try {
      const userfind = await User.findOne({email:email});

      // token generate for reset password
      const token = jwt.sign({_id:userfind._id},process.env.JWT_SECRET,{
          expiresIn:"1d"
      });
      

      const setusertoken = await User.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true});
      const encodedId = encodeURIComponent(userfind.id);
      const encodedToken = encodeURIComponent(setusertoken.verifytoken);
      console.log('setut',setusertoken);

      if(setusertoken){
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            
            user: "akhiltvla@gmail.com",
            pass: "ruie dpjj flmm fwnd",
          },
        });
          const mailOptions = {
              from:'akhiltvla@gmail.com',
              to: email,
              subject:"Sending Email For password Reset",
              text:`This Link Valid For 2 MINUTES ${baseUrl}/seresetpassword/${encodedId}/${encodedToken}}`
          }

          transporter.sendMail(mailOptions,(error,info)=>{
              if(error){
                  console.log("error",error);
                  res.status(401).json({status:401,message:"email not send"})
              }else{
                  console.log("Email sent",info.response);
                  res.status(201).json({status:201,message:"Email sent Succsfully"})
              }
          })

      }

  } catch (error) {
      res.status(401).json({status:401,message:"invalid user"})
  }

}
)



const resetPassword =asyncHandler(async(req,res)=>{
console.log('hohohohohohohoo');
  const {_id, token} = req.params;
  const {password} = req.body
  console.log('id,token,pass',_id,token,password);
  if(token){
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log('decoded',decoded);
        const user = await User.findById(decoded._id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      // Update the user's password in the database
      user.password = password;
      await user.save();
      // Respond with a success message
      res.status(200).json({ message: 'Password updated successfully' });  
    } catch (error) {
        res.status(401)
        throw new Error('Not authorizes, Invalid token')
    }
    }else{
    res.status(401);
    throw new Error('Not Authorized, no token')
    }
}
)


const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.contact = req.body.contact || user.contact
        user.jdate = req.body.jdate || user.jdate
      

        if (req.body.password) {
            user.password = req.body.password
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

                user.photo = imageUrl;
            } catch (error) {
                res.status(500).json({ error: "Image upload failed" });
                return;
            }


        }

        const updateUser = await user.save()

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            contact: updateUser.contact,
            jdate: updateUser.jdate,
            photo: updateUser.photo
        })

    } else {
        res.status(404)
        throw new Error('User not found')
    }
});


const dashUser = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json({ message:'User dahboard is here' })
});

// requestController.js

const materialRequest = async (req, res) => {
    try {
      // Extract data from the request body
      const { name, qty, unit, projectId,seId } = req.body;
    //   console.log("name",name);
  
      // Perform any necessary validation
  
      // Save the material request to the database (using your Mongoose model)
      const material = {
        name,
        qty,
        unit,
      }
    // console.log('material:',material);
      const materialRequest = new Request({
        projectId,
        seId,
        material: [material]

      });
  
      await materialRequest.save();
  
      // Send a success response
      res.status(200).json({ message: 'Material request sent successfully' });
    } catch (error) {
      // Handle errors
      console.error('Error handling material request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const employeeRequest = async (req, res) => {
    try {
      // Extract data from the request body
      const { name, count, projectId,seId } = req.body;
    //   console.log("name",name);
  
      // Perform any necessary validation
  
      // Save the material request to the database (using your Mongoose model)
      const employee = {
        name,
        count,
        
      }
    // console.log('material:',material);
      const employeeRequest = new Request({
        projectId,
        seId,
        employee: [employee]

      });
  
      await employeeRequest.save();
  
      // Send a success response
      res.status(200).json({ message: 'Material request sent successfully' });
    } catch (error) {
      // Handle errors
      console.error('Error handling material request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };




  const equipmentRequest = async (req, res) => {
    try {
      // Extract data from the request body
      const { name, count, projectId,seId } = req.body;
    //   console.log("name",name);
  
      // Perform any necessary validation
  
      // Save the material request to the database (using your Mongoose model)
      const equipment = {
        name,
        count,
        
      }
    // console.log('material:',material);
      const equipmentRequest = new Request({
        projectId,
        seId,
        equipment: [equipment]

      });
  
      await equipmentRequest.save();
  
      // Send a success response
      res.status(200).json({ message: 'Material request sent successfully' });
    } catch (error) {
      // Handle errors
      console.error('Error handling material request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  



const listTeamSe = asyncHandler(async (req, res) => {
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


const seLocation = asyncHandler(async(req,res) => {

    try {
        const {longitude,latitude, seId}= req.body;
       
        const location = {
            longitude,
            latitude
          }
      
        const user =await User.findById(seId)
      
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
          user.position = location
        
          await user.save();
      
          // Send a success response
          res.status(200).json({ message: 'Location saved successfully' });
    } catch (error) {
      console.error('Error saving location:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getUser = async (req,res)=>{
  const id= req.params.id
  console.log('abcd',id);
try {
  const user = await Pm.findById(id)
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


// const getMessage = async (req,res)=>{
//   const id= req.params.id
//   console.log('mess id',id);
// try {
//   const message = await Message.findById(id)
//   if(message){
//     res.status(200).json(message);
//   }
//   else {
//     res.status(404).json("No such Message");
//   }
// } catch (error) {
//   res.status(500).json(error);
// }

// }

export {
    authUser,
    googleAuth,
    registerUser,
    logoutUser,
    resetPassword,
    sendPasswordLink,
    getUserProfile,
    updateUserProfile,
    dashUser,
    listTeamSe,
    materialRequest,
    employeeRequest,
    equipmentRequest,
    listMaterialRequest,
    seLocation,
    getUser,
    // getMessage
}
