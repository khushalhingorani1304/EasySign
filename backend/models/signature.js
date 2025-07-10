const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
    signUrl:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",  
        required:true,
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
});

const Signature = mongoose.model("Signature", signatureSchema);
module.exports = Signature;