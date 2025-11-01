const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_avatars",
    resource_type: "auto",
    public_id: (req, file) => {
      const userId = req.user?.id || "unknown";
      const timestamp = Date.now();
      return `avatar_${userId}_${timestamp}`;
    },
  },
});

// callback để debug
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log(" File received:", file.originalname, file.mimetype, file.size);
    cb(null, true);
  },
});

// hàm debug Cloudinary
cloudinary.api
  .ping()
  .then((result) => console.log(" Cloudinary connected successfully"))
  .catch((err) => console.error(" Cloudinary connection failed:", err));

module.exports = upload;
