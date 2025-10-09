import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        });
        //file has been uploaded
        // console.log("file has been uploaded on cloudinary", response.url)
        // console.log("response print", response)
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally sasved file synchronously
        return null;
    }
}
const getOptimizedUrl = (publicId, width = 1000) => {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width, crop: 'scale' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
};

export { uploadOnCloudinary, getOptimizedUrl };

// export {uploadOnCloudinary}