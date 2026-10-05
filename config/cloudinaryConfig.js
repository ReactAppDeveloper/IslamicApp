const cloudinary = require("cloudinary").v2;

const config = () => {
  if (!process.env.CLOUD_NAME) {
    throw new Error("CLOUD_NAME is missing from .env");
  }

  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing from .env");
  }

  if (!process.env.API_SECRET) {
    throw new Error("API_SECRET is missing from .env");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  console.log("Cloudinary configured successfully");
};

module.exports = config;