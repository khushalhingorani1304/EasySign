// GET /api/v1/easysign/download/:fileId
exports.downloadSignedPDF = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const downloadUrl = file.signedFileUrl || file.fileUrl;

    if (!downloadUrl) {
      return res.status(404).json({ success: false, message: "No document URL available for download" });
    }

    return res.redirect(downloadUrl); // Let browser download from Cloudinary directly
  } catch (err) {
    console.error("Download Error:", err);
    return res.status(500).json({ success: false, message: "Download failed" });
  }
};



// GET /api/v1/easysign/template/:id
exports.downloadTemplate = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    if(!file.isTemplate){
        return res.json({
            success:false,
            message:"Not a Template File!!"
        })
    }

    const downloadUrl = file.signedFileUrl || file.fileUrl;

    if (!downloadUrl) {
      return res.status(404).json({ success: false, message: "No document URL available for download" });
    }

    return res.redirect(downloadUrl); // Let browser download from Cloudinary directly
  } catch (err) {
    console.error("Download Error:", err);
    return res.status(500).json({ success: false, message: "Download failed" });
  }
};


// GET /api/v1/easysign/signature/:userId/:fileId
exports.downloadSignature = async (req, res) => {
  try {
    const { userId, fileId } = req.params;
    const file = await File.findById(fileId);

    const entry = file.signingParties.find(
      (p) => p.user.toString() === userId && p.signatureCanvas
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: "Signature not found" });
    }

    const base64Data = entry.signatureCanvas.split(",")[1];
    const imgBuffer = Buffer.from(base64Data, "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Disposition": "attachment; filename=signature.png",
      "Content-Length": imgBuffer.length,
    });
    res.end(imgBuffer);
  } catch (err) {
    console.error("Download Signature Error:", err);
    res.status(500).json({ success: false, message: "Could not download signature" });
  }
};