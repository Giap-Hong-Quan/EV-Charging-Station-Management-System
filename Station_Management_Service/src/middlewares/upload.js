import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/Cloudinary.js";

const storage=new CloudinaryStorage(
    {
        cloudinary,
        params:async (req, file)=>{
            return{
                folder: "ev_charging_issues",
                resource_type: "auto",
            }
        }
    }
)
const upload = multer({ storage });

export default upload;