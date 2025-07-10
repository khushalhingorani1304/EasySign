const express = require("express");
const router = express.Router();

const {login,signup} = require("../controllers/user");
const {uploadFile,fetchFile,sendInvite,signDocument,getSharedDocuments,getFileById} = require("../controllers/file")
const {uploadSignature,fetchSignature} = require("../controllers/signature")
const { annotateSignature } = require("../controllers/annotateSignature");
const {downloadSignedPDF,downloadSignature, downloadTemplate} = require("../controllers/download");



const {auth} = require("../middlewares/auth");
const upload = require("../middlewares/multer")


// User Routes
router.post("/login",login);
router.post("/signup",signup);


// File Routes
router.post("/upload/file",auth,upload.single("file"),uploadFile);
router.get("/fetch/file",auth,fetchFile);
router.post("/share/file",auth,sendInvite);
router.post("/sign/file",auth,signDocument);
router.get("/shared", auth, getSharedDocuments);
router.get("/file/:id", auth, getFileById); 



// Signature Routes
router.post("/upload/signature",auth,uploadSignature);
router.get("/fetch/signature",auth,fetchSignature);


// Annotate-Signature Routes
router.post("/annotate-signature",auth,annotateSignature);


// Download Routes
router.get("/download/:fileId", auth, downloadSignedPDF);
router.get("/download-template/:fileId",auth,downloadTemplate)
router.get("/download-signature/:userId/:fileId", auth, downloadSignature);


module.exports = router;