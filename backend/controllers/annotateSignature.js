//TODO -> Fetch the document using documentId from DB.
//* Download the PDF from Cloudinary to local server (or buffer).
//* Use pdf-lib to:
//* Load PDF.
//* Decode base64 signature image.
//* Draw the image on given page at (x, y) coordinates.
//* Re-upload the modified PDF to Cloudinary.
//* Update the file record (replace fileUrl with signed version or keep both).
//* Send success response with updated URL.

//^ pdf-lib to manipulate PDFs
//^ axios to fetch the PDF from Cloudinary
//^ fs and path for temp handling
//^ cloudinary.v2 for re-upload


const { PDFDocument } = require('pdf-lib');
const axios = require("axios");
const File = require("../models/file");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier"); // ✅ Required to stream buffer

exports.annotateSignature = async (req, res) => {
  try {
    const { documentId, x, y, signatureCanvas, page } = req.body;

    if (!documentId || !x || !y || !signatureCanvas || !page) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const file = await File.findById(documentId);
    if (!file || !file.fileUrl) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Step 1: Download PDF from Cloudinary
    const pdfResponse = await axios.get(file.signedFileUrl || file.fileUrl, { responseType: "arraybuffer" });


    // Step 2: Load PDF
    const pdfDoc = await PDFDocument.load(pdfResponse.data);

    // Step 3: Embed Signature
    const signatureImageBytes = Buffer.from(signatureCanvas.split(",")[1], "base64");
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const pages = pdfDoc.getPages();

    console.log("📄 Total PDF pages:", pages.length);
    console.log("🖊 Drawing signature on page:", page);


    const targetPage = pages[page - 1];
    const pngDims = signatureImage.scale(0.2);

    console.log("📍 Signature coordinates:", { x: Number(x), y: Number(y) });
    console.log("📏 Signature dimensions:", pngDims);

    targetPage.drawImage(signatureImage, {
      x: Number(x),
      y: Number(y),
      width: pngDims.width,
      height: pngDims.height,
    });

    const { rgb } = require("pdf-lib");

    // targetPage.drawRectangle({
    //   x: Number(x),
    //   y: Number(y),
    //   width: pngDims.width,
    //   height: pngDims.height,
    //   color: rgb(1, 0, 0), // red debug box
    // });


    // Step 4: Save PDF to buffer
    const modifiedPdfBytes = await pdfDoc.save();


    // Temp
    const fs = require("fs");
    fs.writeFileSync('debug-signed.pdf', modifiedPdfBytes);
    console.log("✅ Saved modified PDF locally as debug-signed.pdf");


    // Step 5: Upload PDF to Cloudinary using streamifier
    const cloudinaryUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "EasySign/SignedDocs",
            public_id: `signed_${Date.now()}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        // ✅ Correct way to pipe buffer
        streamifier.createReadStream(modifiedPdfBytes).pipe(stream);
      });

    const result = await cloudinaryUpload();

    // Step 6: Update DB and send response
    file.signedFileUrl = result.secure_url;
    await file.save();

    return res.status(200).json({
      success: true,
      message: "Signature applied and PDF updated successfully",
      signedUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Annotate Signature Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while annotating signature",
    });
  }
};
