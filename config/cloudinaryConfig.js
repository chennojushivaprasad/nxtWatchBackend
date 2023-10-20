import Cloudinary from "cloudinary";
import dotenv from "dotenv";

const cloudinary = Cloudinary.v2;

dotenv.config({ path: ".env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export { cloudinary };
