import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const pmSchema = mongoose.Schema({
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
        required:true
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
    
},
     {
        timestamps: true
    },
);

pmSchema.pre('save',async function(next){
    if(!this.isModified('password')){  
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

pmSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const Pm = mongoose.model('Pm',pmSchema)

export default Pm