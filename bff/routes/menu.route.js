import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { once } from 'events';

dotenv.config();

const router = express.Router();
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE;

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper function to ensure stream is finished before deleting the file
const trackedReadStream = (filePath) => {
  const stream = fs.createReadStream(filePath);
  process.nextTick(() => {
    once(stream, 'close').then(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete ${filePath}`, err);
      });
    });
  });
  return stream;
};

// Set up multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Menu item upload middleware
const menuItemUpload = upload.fields([
  { name: 'image', maxCount: 1 }
]);

// Public: View Menu Items of a Restaurant
// router.get('/:id/menu', async (req, res) => {
//   try {
//     const response = await axios.get(`${RESTAURANT_SERVICE}/${req.params.id}/menu`);
//     res.json(response.data);
//   } catch (err) {
//     res.status(err.response?.status || 500).json({ message: err.message });
//   }
// });

// Public: View Menu Items of a Restaurant
router.get('/:id/menu', async (req, res) => {
  try {
    console.log(`Attempting to fetch menu for restaurant ${req.params.id}`);
    console.log(`Calling: ${RESTAURANT_SERVICE}/${req.params.id}/menu`);
    
    const response = await axios.get(`${RESTAURANT_SERVICE}/${req.params.id}/menu`);
    console.log('Menu items fetched successfully');
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    console.error('Response status:', err.response?.status);
    console.error('Response data:', err.response?.data);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Get single menu item
router.get('/:id/menu/:itemId', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE}/${req.params.id}/menu/${req.params.itemId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Protected routes with authentication
router.use(authenticate);

// Protected: Add a Menu Item with image upload
router.post('/:id/menu', menuItemUpload, async (req, res) => {
  try {
    const formData = new FormData();
    
    // Add JSON data
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    // Add image file if it exists
    if (req.files && req.files.image && req.files.image[0]) {
      formData.append('image', trackedReadStream(req.files.image[0].path), {
        filename: req.files.image[0].originalname,
        contentType: req.files.image[0].mimetype,
        knownLength: req.files.image[0].size
      });
    }
    
    const response = await axios.post(`${RESTAURANT_SERVICE}/${req.params.id}/menu`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: req.headers.authorization,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    res.status(201).json(response.data);
  } catch (err) {
    console.error('Error details:', err);
    res.status(err.response?.status || 500).json({ 
      message: err.message,
      details: err.response?.data || 'Unknown error'
    });
  }
});

// Protected: Update a Menu Item with image upload
router.put('/:id/menu/:itemId', menuItemUpload, async (req, res) => {
  try {
    const formData = new FormData();
    
    // Add JSON data
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    // Add image file if it exists
    if (req.files && req.files.image && req.files.image[0]) {
      formData.append('image', trackedReadStream(req.files.image[0].path), {
        filename: req.files.image[0].originalname,
        contentType: req.files.image[0].mimetype,
        knownLength: req.files.image[0].size
      });
    }
    
    const response = await axios.put(
      `${RESTAURANT_SERVICE}/${req.params.id}/menu/${req.params.itemId}`, 
      formData, 
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: req.headers.authorization,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    
    res.json(response.data);
  } catch (err) {
    console.error('Error in updating menu item:', err);
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Protected: Delete a Menu Item
router.delete('/:id/menu/:itemId', async (req, res) => {
  try {
    const response = await axios.delete(
      `${RESTAURANT_SERVICE}/${req.params.id}/menu/${req.params.itemId}`, 
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;
