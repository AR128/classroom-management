import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|jpg)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});