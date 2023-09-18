import express from "express";
const router = express.Router();
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeTypes = fileTypes.test(file.mimeTypes);
  if (extname && mimeTypes) {
    return cb(null, true);
  } else {
    return cb("Images Only");
  }
}

const upload = multer({
  storage,
});

router.post("/", upload.single("image"), (req, res) => {
  const imageUrl = req.file.path.replace("\\", "/");
  res.send({ message: "Image Uploded", image: `/${imageUrl}` });
});

export default router;
