import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    contact: {
        type: Number,
        
    },
    password: {
        type: String,
    },
   
    jdate: {
        type: Date,
        
    },
    photo:{
        type: String
    },
    isauthorise:{
        type: Boolean,
        default:false
    },
     isblocked:{
        type:Boolean,
        default:false
     },
   
    position:{
        longitude:{
            type:Number,  
        },
        latitude:{
            type:Number,
        }
    },
    token:{
        type:String
    },
    verifytoken:{
        type:String
    }
    
},
     {
        timestamps: true
    },
);

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){  
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User',userSchema)
export default User

