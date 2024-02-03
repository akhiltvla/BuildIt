import mongoose from 'mongoose'


const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique: true
    },
    place: {
        type: String,
        required:true,
        
    },
    client: {
        type: String,
        required:true,
        
    },
    pm: {
        type: String,
        required:true
    },
    se: {
        type: String,
        required:true,
      
    },
    photo:{
        type: String
    },
    sdate: {
        type: Date,
        required:true,
        
    },
    edate: {
        type: Date,
        
        
    },
    pdf:[{
        type: String,
        
    }]
        
    
},
     {
        timestamps: true
    },
);



const Project = mongoose.model('Project',projectSchema)

export default Project