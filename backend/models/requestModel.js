import mongoose from 'mongoose'


const requestSchema = mongoose.Schema({
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: 'project',
        
        required: true
    },

    seId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        
        required: true
    },
    ispermit:{
        type:Boolean,
        default:false
     },

     isreject:{
        type:Boolean,
        default:false
     },

     createdAt: {
        type: Date,
      },
    material: [{
        name: {
            type: String,
           
        },
        qty: {
            type: Number,
            
        },
        unit: {
            type:String,
           
        }
        
    }],
    employee: 
    [{
        name: {
            type: String,
            
        },
        
        count: {
            type: Number,
           
        },
        
    }],

    equipment:[{
        name: {
            type: String,
            
        },
        
        count: {
            type: Number,
          
        },
        
    }],
    
        
},
     {
        timestamps: true
    },
);

requestSchema.virtual('materialName').get(function() {
    return this.material.name;
  });

const Request = mongoose.model('Request',requestSchema)

export default Request