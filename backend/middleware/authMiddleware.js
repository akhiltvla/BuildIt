import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import Pm from '../models/pmModel.js'
import Admin from '../models/adminModel.js';

const protect  = asyncHandler(async (req,res,next)=>{
let token;

token = req.cookies.jwt

if(token){
try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    req.user = await User.findById(decoded.userId).select('-password')
    next();
} catch (error) {
    res.status(401)
    throw new Error('Not authorizes, Invalid token')
    
}
}else{
res.status(401);
throw new Error('Not Authorized, no token')
}
})


const pmProtect  = asyncHandler(async (req,res,next)=>{
    let token;
    
    token = req.cookies.pmjwt
    
    if(token){
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
        req.pm = await Pm.findById(decoded.pmId).select('-password')
        next();
    } catch (error) {
        res.status(401)
        throw new Error('Not authorizes, Invalid token')
        
    }
    
    
    }else{
    res.status(401);
    throw new Error('Not Authorized, no token')
    
    }
    
    
    })


    const seProtect  = asyncHandler(async (req,res,next)=>{
        let token;
        
        token = req.cookies.sejwt
        
        if(token){
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
        
            req.se = await User.findById(decoded.seId).select('-password')
            next();
        } catch (error) {
            res.status(401)
            throw new Error('Not authorizes, Invalid token')
            
        }
        
        
        }else{
        res.status(401);
        throw new Error('Not Authorized, no token')
        
        }
        
        
        })

    const adminProtect  = asyncHandler(async (req,res,next)=>{
        let token;
        
        token = req.cookies.adminjwt
        
        if(token){
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
        
            req.admin = await Admin.findById(decoded.adminId).select('-password')
            next();
        } catch (error) {
            res.status(401)
            throw new Error('Not authorizes, Invalid token')
            
        }
         
        }else{
        res.status(401);
        throw new Error('Not Authorized, no token')
        
        }
        
        
        })

export {protect, pmProtect, adminProtect, seProtect}