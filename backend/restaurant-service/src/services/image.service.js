import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

/**
 * Upload a single image to Cloudinary
 * @param {Object} file - The file object from multer
 * @param {String} folder - The folder in Cloudinary to store the image
 * @returns {Promise<Object>} - The Cloudinary upload result
 */
export const uploadImage = async (file, folder = 'restaurants') => {
  try {
    if (!file) return null;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'image'
    });
    
    // Remove the file from local storage after upload
    fs.unlinkSync(file.path);
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    // Remove the file if upload failed
    if (file && file.path) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects from multer
 * @param {String} folder - The folder in Cloudinary to store the images
 * @returns {Promise<Array>} - Array of Cloudinary upload results
 */
export const uploadMultipleImages = async (files, folder = 'restaurants') => {
  if (!files || !files.length) return [];
  
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return await Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - The Cloudinary deletion result
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return null;
  
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of public IDs to delete
 * @returns {Promise<Array>} - Array of Cloudinary deletion results
 */
export const deleteMultipleImages = async (publicIds) => {
  if (!publicIds || !publicIds.length) return [];
  
  const deletePromises = publicIds.map(publicId => deleteImage(publicId));
  return await Promise.all(deletePromises);
};