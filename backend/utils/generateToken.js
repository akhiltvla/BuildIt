import jwt from 'jsonwebtoken'


const generateToken = (res, userId)=>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })


res.cookie('jwt',token,{
    httpOnly : true,
    secure: process.env.NODE_ENV !=='development',
    sameSite: 'strict',
    maxAge: 30*24*60*60*1000

})

}


const generateSeforgotToken = ( userId)=>{
        const token=  jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn:'120s'
    })
  
return token;
    
}
const generatePmToken = (res, pmId)=>{
    const pmtoken = jwt.sign({ pmId }, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })


res.cookie('pmjwt',pmtoken,{
    httpOnly : true,
    secure: process.env.NODE_ENV !=='development',
    sameSite: 'strict',
    maxAge: 30*24*60*60*1000

})

}


const generateAdminToken = (res, adminId)=>{
    const admintoken = jwt.sign({ adminId }, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })


res.cookie('adminjwt',admintoken,{
    httpOnly : true,
    secure: process.env.NODE_ENV !=='development',
    sameSite: 'strict',
    maxAge: 30*24*60*60*1000

})

}



export {generateToken, generateSeforgotToken,generatePmToken,generateAdminToken}