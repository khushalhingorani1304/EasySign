const mongoose = require("mongoose");

const fileScema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    fileUrl:{
        type:String,
        required:true,
    },
    signedFileUrl: {
        type: String,
        default: null, 
    },

    signatureCanvas:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    signingParties:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            email: {
                type: String, // optional fallback if user not registered yet
            },
            signed:{
                type:Boolean,
                default:false,
            },
            signedAt:{
                type:Date,
            },
            signatureCanvas:{
                type:String
            }
        }
    ],
    isTemplate:{
        type:Boolean,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Partially Signed","Completed"],
        default:"Pending"
    },

},{ timestamps: true })



const File = new mongoose.model("File",fileScema);
module.exports = File;