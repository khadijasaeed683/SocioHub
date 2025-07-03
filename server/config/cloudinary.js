// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;

// const connectCloudinary = () => {

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
console.log("cloudinary",cloudinary.config()); // should print your cloud_name etc.
    // }


module.exports = cloudinary ;
