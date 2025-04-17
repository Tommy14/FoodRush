import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { once } from 'events';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

dotenv.config();

const router = express.Router();
const RESTAURANT_API = process.env.RESTAURANT_SERVICE;

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// 👇 Helper function to ensure stream is finished before deleting the file
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

// Restaurant upload middleware
const restaurantUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

// router.use(authenticate);

// Utility function to safely delete file
const safeDeleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
};

// Utility function to clean up all uploaded files
const cleanupFiles = (files) => {
  if (!files) return;
  
  Object.keys(files).forEach(key => {
    files[key].forEach(file => {
      safeDeleteFile(file.path);
    });
  });
};

// Public: Get all approved restaurants
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Public: Get single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

router.use(authenticate);

// Restaurant Admin: Create restaurant with file upload
router.post('/', restaurantUpload, async (req, res) => {
  try {
    const formData = new FormData();
    
    // Add JSON data
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    // Add files if they exist
    if (req.files) {
      // Handle logo file
      if (req.files.logo && req.files.logo[0]) {
        formData.append('logo', trackedReadStream(req.files.logo[0].path), {
          filename: req.files.logo[0].originalname,
          contentType: req.files.logo[0].mimetype,
          knownLength: req.files.logo[0].size
        });
      }
      
      // Handle coverImage file
      if (req.files.coverImage && req.files.coverImage[0]) {
        formData.append('coverImage', trackedReadStream(req.files.coverImage[0].path), {
          filename: req.files.coverImage[0].originalname,
          contentType: req.files.coverImage[0].mimetype,
          knownLength: req.files.coverImage[0].size
        });
      }
      
      // Handle multiple gallery images
      if (req.files.images) {
        req.files.images.forEach(image => {
          formData.append('images', trackedReadStream(image.path), {
            filename: image.originalname,
            contentType: image.mimetype,
            knownLength: image.size
          });
        });
      }
    }
    
    // Debug information
    console.log('FormData headers:', formData.getHeaders());
    
    const response = await axios.post(`${RESTAURANT_API}/`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: req.headers.authorization,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    // Clean up temp files
    // cleanupFiles(req.files);
    
    res.status(201).json(response.data);
  } catch (err) {
    console.error('Error details:', err);
    
    // Clean up temp files on error
    // cleanupFiles(req.files);
    
    res.status(err.response?.status || 500).json({ 
      message: err.message,
      details: err.response?.data || 'Unknown error'
    });
  }
});

// Restaurant Admin: Update restaurant with file upload
router.put('/:id', restaurantUpload, async (req, res) => {
  try {
    const formData = new FormData();
    
    // Add JSON data
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    // Add files if they exist
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        formData.append('logo', trackedReadStream(req.files.logo[0].path), {
          filename: req.files.logo[0].originalname,
          contentType: req.files.logo[0].mimetype
        });
      }
      
      if (req.files.coverImage && req.files.coverImage[0]) {
        formData.append('coverImage', trackedReadStream(req.files.coverImage[0].path), {
          filename: req.files.coverImage[0].originalname,
          contentType: req.files.coverImage[0].mimetype
        });
      }
      
      if (req.files.images) {
        req.files.images.forEach(image => {
          formData.append('images', trackedReadStream(image.path), {
            filename: image.originalname,
            contentType: image.mimetype
          });
        });
      }
    }
    
    const response = await axios.put(`${RESTAURANT_API}/${req.params.id}`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: req.headers.authorization,
      },
    });
    
    // Clean up temp files
    // cleanupFiles(req.files);
    
    res.json(response.data);
  } catch (err) {
    // Clean up temp files on error
    // cleanupFiles(req.files);
    
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Delete restaurant image
router.delete('/:restaurantId/images/:imageId', async (req, res) => {
  try {
    const response = await axios.delete(
      `${RESTAURANT_API}/${req.params.restaurantId}/images/${req.params.imageId}`, 
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Delete restaurant
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${RESTAURANT_API}/${req.params.id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Admin: Get all restaurants
router.get('/admin/all', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/admin/all`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Admin: Get pending restaurants
router.get('/admin/pending', async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/admin/pending`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Admin: Approve restaurant
router.patch('/:id/approve', async (req, res) => {
  try {
    const response = await axios.patch(`${RESTAURANT_API}/${req.params.id}/approve`, {}, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Toggle open status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const response = await axios.patch(`${RESTAURANT_API}/${req.params.id}/toggle`, {}, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

export default router;