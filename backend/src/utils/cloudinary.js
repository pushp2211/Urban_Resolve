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
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    if (!url.includes('cloudinary.com')) return null;

    const parts = url.split('/upload/');
    if (parts.length < 2) return null;

    const pathAfterUpload = parts[1];
    const segments = pathAfterUpload.split('/');

    const publicIdSegments = [];
    for (const segment of segments) {
      if (/^v\d+$/.test(segment)) {
        continue;
      }
      if (
        segment.includes(',') ||
        segment.startsWith('c_') ||
        segment.startsWith('w_') ||
        segment.startsWith('h_') ||
        segment.startsWith('q_') ||
        segment.startsWith('f_')
      ) {
        continue;
      }
      publicIdSegments.push(segment);
    }

    const fullFileName = publicIdSegments.join('/');
    const lastDotIndex = fullFileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fullFileName.substring(0, lastDotIndex) : fullFileName;
  } catch (error) {
    console.error('Error extracting public ID from Cloudinary URL:', error);
    return null;
  }
};

const deleteFromCloudinary = async (publicIdOrUrl) => {
  try {
    if (!publicIdOrUrl) return null;
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
      publicId = extractPublicId(publicIdOrUrl);
    }
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return null;
  }
};

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

export { uploadOnCloudinary, getOptimizedUrl, deleteFromCloudinary, extractPublicId };