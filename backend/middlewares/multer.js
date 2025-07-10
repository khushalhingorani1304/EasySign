// middleware/multer.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".pdf" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only PDFs and Images are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
