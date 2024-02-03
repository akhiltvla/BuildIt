import asyncHandler from 'express-async-handler';
import Pm from '../models/pmModel.js';
import User from '../models/userModel.js';




const logoutPm = async (res,pmId) => {

  pmId=null;
  
  res.cookie('pmjwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
 
};
// Middleware to block/unblock Project Manager
export const blockPmMiddleware = asyncHandler(async (req, res, next) => {
  const pmId = req.params.id;

  try {
    const pm = await Pm.findById(pmId);

    if (!pm) {
      return res.status(404).json({ message: 'Project Manager not found' });
    }

    pm.isblocked = true;
   
    await pm.save();

    logoutPm(res,pmId);
    
    return res.status(200).json({ message: 'Project Manager blocked successfully' });
  } catch (error) {
    console.error('Error blocking Project Manager:', error);
    res.status(500).json({ message: 'Failed to block the Project Manager' });
  }
});

// Middleware to unblock Project Manager
export const unblockPmMiddleware = asyncHandler(async (req, res, next) => {
  const pmId = req.params.id;

  try {
    const pm = await Pm.findById(pmId);

    if (!pm) {
      return res.status(404).json({ message: 'Project Manager not found' });
    }

    pm.isblocked = false;
    await pm.save();

    res.status(200).json({ message: 'Project Manager unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking Project Manager:', error);
    res.status(500).json({ message: 'Failed to unblock the Project Manager' });
  }
});

// Middleware to block/unblock Site Engineer
export const blockSeMiddleware = asyncHandler(async (req, res, next) => {
  const seId = req.params.id;

  try {
    const se = await User.findById(seId);

    if (!se) {
      return res.status(404).json({ message: 'Site Engineer not found' });
    }

    se.isblocked = true;
    await se.save();

    res.status(200).json({ message: 'Site Engineer blocked successfully' });
  } catch (error) {
    console.error('Error blocking Site Engineer:', error);
    res.status(500).json({ message: 'Failed to block the Site Engineer' });
  }
});

// Middleware to unblock Site Engineer
export const unblockSeMiddleware = asyncHandler(async (req, res, next) => {
  const seId = req.params.id;

  try {
    const se = await User.findById(seId);

    if (!se) {
      return res.status(404).json({ message: 'Site Engineer not found' });
    }

    se.isblocked = false;
    await se.save();

    res.status(200).json({ message: 'Site Engineer unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking Site Engineer:', error);
    res.status(500).json({ message: 'Failed to unblock the Site Engineer' });
  }
});

export default { blockPmMiddleware, unblockPmMiddleware, blockSeMiddleware, unblockSeMiddleware };
