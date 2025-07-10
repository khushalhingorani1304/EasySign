const File = require("../models/file");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const mongoose = require("mongoose")

const User = require("../models/user")
const nodemailer = require("nodemailer");

require("dotenv").config();

exports.uploadFile = async (req, res) => {
  try {
    const { title, isTemplate, signatureCanvas } = req.body;
    const file = req.file;

    if (!file || !title || !signatureCanvas) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uniqueName = `doc_${Date.now()}`;

    // Upload from disk using file.path
    const uploadedFile = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "EasySign/Files",
      public_id: uniqueName,
      type:"upload",
    });

    // Remove the local file after upload
    fs.unlinkSync(file.path);

    const newFile = await File.create({
      title,
      fileUrl: uploadedFile.secure_url,
      signatureCanvas,
      createdBy: req.user.id,
      signingParties: [{ user: req.user.id, signed: true, signedAt: new Date() }],
      isTemplate: isTemplate === "true",
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Something went wrong while uploading the file" });
  }
};


exports.fetchFile = async(req,res) => {
  try {
    const userId = req.user.id;

    // const files = await File.find({ createdBy: userId }).sort({ createdAt: -1 });

    // console.log("Logged in user ID:", userId);
    const files = await File.find({ createdBy: userId }).sort({ createdAt: -1 });
    // console.log("Fetched files:", files);


    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No documents found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      files,
    });
  } catch (error) {
    console.error("Fetch files error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching documents",
    });
  }
};



//^ ✅ Step 5.3: Frontend Flow
//^ Step	What Happens
//^ User clicks email link	→ Redirect to login/signup if not authenticated
//^ After login	→ Fetch doc by id and show sign page
//^ On submit	→ Add user to signingParties[] with signed: true



//* Send Invite to other User for signing

exports.sendInvite = async (req, res) => {
  try {
    const { documentId, recieverEmail } = req.body;

    if (!documentId || !recieverEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing Email or Document ID!",
      });
    }

    const file = await File.findById(documentId);
    if (!file) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const recipient = await User.findOne({ email: recieverEmail });

    const alreadyAdded = file.signingParties.some(
      (entry) =>
        entry.user?.toString() === recipient?._id?.toString() || entry.email === recieverEmail
    );

    if (!alreadyAdded) {
      file.signingParties.push({
        user: recipient?._id || undefined,
        email: recieverEmail, // ✅ added for fallback
        signed: false,
        signedAt: null,
        signatureCanvas: null,
      });

      await file.save();
    }

    const link = `http://localhost:5173/sign/${documentId}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: recieverEmail,
      subject: "EasySign - Document Signature Request",
      html: `<p>You have been invited to sign a document.</p>
             <p><strong>Note:</strong> Please log in to access the document.</p>
             <p><a href="${link}">Click here to sign</a></p>`,
    });

    return res.status(200).json({ success: true, message: "Invite sent via email" });

  } catch (err) {
    console.error("Send Invite Error:", err);
    return res.status(500).json({ success: false, message: "Server error while sending invite" });
  }
};




exports.signDocument = async (req, res) => {
  try {
    const { documentId, signatureCanvas } = req.body;

    if (!documentId || !signatureCanvas) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const file = await File.findById(documentId);
    if (!file) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;

    let updated = false;

    file.signingParties = file.signingParties.map((entry) => {
      if (
        (entry.user && entry.user.toString() === userId) ||
        (!entry.user && entry.email === userEmail)
      ) {
        updated = true;
        return {
          ...entry,
          user: userId,
          email: userEmail,
          signed: true,
          signedAt: new Date(),
          signatureCanvas,
        };
      }
      return entry;
    });

    if (!updated) {
      file.signingParties.push({
        user: userId,
        email: userEmail,
        signed: true,
        signedAt: new Date(),
        signatureCanvas,
      });
    }

    const total = file.signingParties.length;
    const signedCount = file.signingParties.filter(p => p.signed).length;

    if (signedCount === 0) {
      file.status = "Pending";
    } else if (signedCount < total) {
      file.status = "Partially Signed";
    } else {
      file.status = "Completed";
    }

    await file.save();

    return res.status(200).json({
      success: true,
      message: "Document signed successfully",
      file,
    });

  } catch (err) {
    console.error("Sign Error:", err);
    return res.status(500).json({ success: false, message: "Server error while signing" });
  }
};




exports.getSharedDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email?.toLowerCase();

    // console.log("🔍 userId:", userId);
    // console.log("🔍 userEmail:", userEmail);

    const sharedFiles = await File.find({
      $or: [
        { "signingParties.user": userId },
        { "signingParties.email": userEmail },
      ],
      createdBy: { $ne: userId },
    })
      .populate("createdBy", "name email")
      .select("title status createdAt signingParties fileUrl createdBy");

    // console.log("📦 Found shared files:", sharedFiles.length);
    sharedFiles.forEach((file, i) => {
      // console.log(`➡️  [${i}] Title: ${file.title}`);
    });

    return res.status(200).json({
      success: true,
      documents: sharedFiles,
    });

  } catch (err) {
    console.error("❌ Fetch shared docs error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shared documents",
    });
  }
};




//Get file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // ✅ Add signedFileUrl here
    const response = {
      _id: file._id,
      title: file.title,
      status: file.status,
      fileUrl: file.fileUrl,
      signedFileUrl: file.signedFileUrl || null, // ✅ include this
      filename: file.filename || "document.pdf",
      createdAt: file.createdAt,
      owner: {
        email: file.createdBy.email,
      },
      signatures: file.signingParties
        .filter(p => p.signed)
        .map(p => ({
          user: p.user,
          signedAt: p.signedAt,
        }))
    };

    return res.status(200).json({ success: true, file: response });

  } catch (err) {
    console.error("Error fetching file by ID:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
