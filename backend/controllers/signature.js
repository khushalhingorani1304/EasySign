const Signature = require("../models/signature")

exports.uploadSignature = async(req,res) => {
    try {
        
        const { signUrl } = req.body;

        if (!signUrl) {
            return res.status(400).json({
                success: false,
                message: "Signature image (base64 or URL) is required"
            });
        }

        const newSignature = await Signature.create({
            user: req.user.id,
            signUrl,
        });

        return res.status(201).json({
            success: true,
            message: "Signature saved successfully",
            signature: newSignature
        });
    }catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something Went wrong while uploading Signature"
        })
    }
}


exports.fetchSignature = async(req,res) =>{
    try {
        const userId = req.user.id;

        const latestSignature = await Signature.findOne({user:userId}).sort({createdAt:-1});
        
        if (!latestSignature) {
            return res.status(404).json({
            success: false,
            message: "No signature found for this user"
        });
        }

        return res.status(200).json({
            success: true,
            latestSignature
        });
    } catch (err) {
        console.error("Error fetching signature:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching signature"
        });
    }
};