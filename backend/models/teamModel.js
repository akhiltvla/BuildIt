import mongoose from 'mongoose'

import Project from './projectModel.js'
import Pm from './pmModel.js'

const teamSchema = mongoose.Schema({
    
    projectId:{
        type: mongoose.Types.ObjectId,
        ref: 'project',
         required: true
    },

    pmId:{
        type: mongoose.Types.ObjectId,
        ref: 'pm',
        required: true
    },

    name: {
        type: String,
        required:true
    },
    role: {
        type: String,
    },
    email: {
        type: String,
        required:true,
        
    },
    contact: {
        type: Number,
        
    },
    
},
     {
        timestamps: true
    },
);





const Team = mongoose.model('Team',teamSchema)

export default Team