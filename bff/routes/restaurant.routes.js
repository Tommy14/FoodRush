import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { once } from "events";
import { authenticate } from "../middleware/auth.js";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import path from "path";

dotenv.config();

const router = express.Router();
const RESTAURANT_API = process.env.RESTAURANT_SERVICE;

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "tmp", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// 👇 Helper function to ensure stream is finished before deleting the file
const trackedReadStream = (filePath) => {
  const stream = fs.createReadStream(filePath);
  process.nextTick(() => {
    once(stream, "close").then(() => {
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
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Restaurant upload middleware
const restaurantUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

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

  Object.keys(files).forEach((key) => {
    files[key].forEach((file) => {
      safeDeleteFile(file.path);
    });
  });
};

// Public: Get all approved restaurants
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/`);

    // Enrich all restaurants with location data
    if (response.data && Array.isArray(response.data)) {
      const LOCATION_API = process.env.LOCATION_SERVICE;
      const enrichedRestaurants = await Promise.all(
        response.data.map(async (restaurant) => {
          if (restaurant._id) {
            try {
              const locationResponse = await axios.get(
                `${LOCATION_API}/restaurant/${restaurant._id}`
              );

              if (locationResponse.data) {
                return {
                  ...restaurant,
                  formattedAddress:
                    locationResponse.data.address?.formattedAddress,
                  coordinates: locationResponse.data.location?.coordinates,
                };
              }
            } catch (err) {
              console.error(
                `Failed to fetch location for restaurant ${restaurant._id}:`,
                err
              );
            }
          }
          return restaurant;
        })
      );

      res.json(enrichedRestaurants);
    } else {
      res.json(response.data);
    }
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// router.use(authenticate);
// Add authentication middleware for protected routes
router.use("/owner", authenticate);
router.use("/admin", authenticate);
// Restaurant Admin: Get all restaurants for the owner
router.get("/owner", async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_API}/owner`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Get owner restaurants error:", err);
    res.status(err.response?.status || 500).json({
      message:
        err.response?.data?.message || "Failed to fetch your restaurants",
    });
  }
});

// Admin: Get all restaurants
router.get("/admin/all", async (req, res) => {
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
router.get("/admin/pending", async (req, res) => {
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
// Modify the POST route handler for restaurant creation

// Public: Get single restaurant by ID
router.get("/:id", async (req, res) => {
  try {

    // Prepare headers to forward any auth token if present
    const headers = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    // Forward the request with any auth headers
    const response = await axios.get(`${RESTAURANT_API}/${req.params.id}`, {
      headers,
    });

    // Enrich response with owner details if available
    if (response.data && response.data.owner) {
      try {
        const USER_API = process.env.AUTH_SERVICE;
        const ownerResponse = await axios.get(
          `${USER_API}/by/${response.data.owner}`,
          { headers }
        );
    
        if (ownerResponse.data) {
          response.data.ownerName = ownerResponse.data.name;
          response.data.ownerId = ownerResponse.data._id;
        }
      } catch (ownerErr) {
        console.error("Unable to fetch owner details:", ownerErr.message);
        // Continue without owner details
      }
    }

    // STEP 2: Enrich with location data
    if (response.data && response.data._id) {
      try {
        const LOCATION_API = process.env.LOCATION_SERVICE;
        const locationResponse = await axios.get(
          `${LOCATION_API}/restaurant/${response.data._id}`,
          { headers }
        );

        if (locationResponse.data) {
          // Only add what's truly needed
          response.data.coordinates =
            locationResponse.data.location?.coordinates;
          // Maybe add distance if user coordinates are provided in query
          if (req.query.lat && req.query.lng) {
            response.data.distance = calculateDistance(
              [req.query.lng, req.query.lat],
              locationResponse.data.location?.coordinates
            );
          }
        }
      } catch (locationErr) {
        console.error("Unable to fetch location details:", locationErr.message);
      }
    }

    res.json(response.data);
  } catch (err) {
    console.error(`Error fetching restaurant ${req.params.id}:`, err.message);

    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    res.status(500).json({
      message: "Failed to fetch restaurant details",
      error: err.message,
    });
  }
});

// General authentication middleware for remaining routes
router.use(authenticate);

// Restaurant Admin: Create restaurant with file upload
router.post("/", restaurantUpload, async (req, res) => {
  try {

    const formData = new FormData();

    // Add JSON data - handle fields that need to be JSON strings properly
    Object.keys(req.body).forEach((key) => {
      // For arrays like cuisineTypes, we need special handling
      if (key === "cuisineTypes") {
        if (Array.isArray(req.body[key])) {
          req.body[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          // If it's a single value
          formData.append(key, req.body[key]);
        }
      }
      // For objects that need to be sent as JSON strings
      else if (key === "address" || key === "openingHours") {
        try {
          // Check if it's already a string
          const value =
            typeof req.body[key] === "string"
              ? req.body[key]
              : JSON.stringify(req.body[key]);
          formData.append(key, value);
        } catch (e) {
          console.error(`Error processing ${key}:`, e);
          formData.append(key, req.body[key]);
        }
      }
      // For regular fields
      else {
        formData.append(key, req.body[key]);
      }
    });

    // Add files if they exist
    if (req.files) {
      // Handle logo file
      if (req.files.logo && req.files.logo[0]) {
        formData.append("logo", fs.createReadStream(req.files.logo[0].path), {
          filename: req.files.logo[0].originalname,
          contentType: req.files.logo[0].mimetype,
        });
      }

      // Handle coverImage file
      if (req.files.coverImage && req.files.coverImage[0]) {

        formData.append(
          "coverImage",
          fs.createReadStream(req.files.coverImage[0].path),
          {
            filename: req.files.coverImage[0].originalname,
            contentType: req.files.coverImage[0].mimetype,
          }
        );
      }

      // Handle multiple gallery images
      if (req.files.images) {
        req.files.images.forEach((image) => {
          formData.append("images", fs.createReadStream(image.path), {
            filename: image.originalname,
            contentType: image.mimetype,
          });
        });
      }
    }

    const response = await axios.post(`${RESTAURANT_API}/`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: req.headers.authorization,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });


    // Clean up temp files after successful creation
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        const files = req.files[key];
        if (Array.isArray(files)) {
          files.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err)
                console.error(`Failed to delete temp file ${file.path}:`, err);
            });
          });
        }
      });
    }

    res.status(201).json(response.data);
  } catch (err) {
    console.error("Restaurant creation error in BFF:", err.message);

    // Add more detailed error information
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }

    // Clean up temp files on error
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        const files = req.files[key];
        if (Array.isArray(files)) {
          files.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err)
                console.error(`Failed to delete temp file ${file.path}:`, err);
            });
          });
        }
      });
    }

    // Send appropriate error response
    if (err.response) {
      res.status(err.response.status).json({
        message: err.response.data.message || err.message,
        details: err.response.data,
      });
    } else {
      res.status(500).json({
        message: "Failed to create restaurant",
        error: err.message,
      });
    }
  }
});

// Restaurant Admin: Update restaurant with file upload
router.put("/:id", restaurantUpload, async (req, res) => {
  try {
    const formData = new FormData();

    // JSON data with proper handling for arrays and objects
    Object.keys(req.body).forEach((key) => {
      // For arrays like cuisineTypes
      if (key === "cuisineTypes") {
        if (Array.isArray(req.body[key])) {
          req.body[key].forEach((item) => {
            formData.append(key, item);
          });
        } else if (typeof req.body[key] === "string") {
          try {
            // Try parsing it as JSON first
            const parsedArray = JSON.parse(req.body[key]);
            if (Array.isArray(parsedArray)) {
              parsedArray.forEach((item) => {
                formData.append(key, item);
              });
            } else {
              formData.append(key, req.body[key]);
            }
          } catch (e) {
            // If parsing fails, treat as single value
            formData.append(key, req.body[key]);
          }
        } else {
          // If it's a single value
          formData.append(key, req.body[key]);
        }
      }
      // For objects that need to be sent as JSON strings
      else if (key === "address" || key === "openingHours") {
        try {
          const value =
            typeof req.body[key] === "string"
              ? req.body[key]
              : JSON.stringify(req.body[key]);
          formData.append(key, value);
        } catch (e) {
          console.error(`Error processing ${key}:`, e);
          formData.append(key, req.body[key]);
        }
      }
      // For regular fields
      else {
        formData.append(key, req.body[key]);
      }
    });

    // Add files if they exist
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        formData.append("logo", trackedReadStream(req.files.logo[0].path), {
          filename: req.files.logo[0].originalname,
          contentType: req.files.logo[0].mimetype,
        });
      }

      if (req.files.coverImage && req.files.coverImage[0]) {
        formData.append(
          "coverImage",
          trackedReadStream(req.files.coverImage[0].path),
          {
            filename: req.files.coverImage[0].originalname,
            contentType: req.files.coverImage[0].mimetype,
          }
        );
      }

      if (req.files.images) {
        req.files.images.forEach((image) => {
          formData.append("images", trackedReadStream(image.path), {
            filename: image.originalname,
            contentType: image.mimetype,
          });
        });
      }
    }

    const response = await axios.put(
      `${RESTAURANT_API}/${req.params.id}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: req.headers.authorization,
        },
      }
    );

    // Parse stringified JSON fields in the response
    if (response.data) {
      if (typeof response.data.address === "string") {
        try {
          response.data.address = JSON.parse(response.data.address);
        } catch (err) {
          console.error("Failed to parse address JSON:", err);
        }
      }

      if (typeof response.data.openingHours === "string") {
        try {
          response.data.openingHours = JSON.parse(response.data.openingHours);
        } catch (err) {
          console.error("Failed to parse openingHours JSON:", err);
        }
      }
    }

    res.json(response.data);
  } catch (err) {
    // Clean up temp files on error
    // cleanupFiles(req.files);

    res.status(err.response?.status || 500).json({ message: err.message });
  }
});

// Restaurant Admin: Delete restaurant image
router.delete("/:restaurantId/images/:imageId", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
// Admin: Get pending restaurants
router.patch("/:id/status", async (req, res) => {
  try {
    const response = await axios.patch(
      `${RESTAURANT_API}/${req.params.id}/status`,
      { status: req.body.status },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message,
    });
  }
});
// Admin: Approve restaurant
router.patch("/:id/approve", async (req, res) => {
  try {
    const response = await axios.patch(
      `${RESTAURANT_API}/${req.params.id}/approve`,
      {},
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

// Restaurant Admin: Toggle open status
router.patch("/:id/toggle", async (req, res) => {
  try {
    const response = await axios.patch(
      `${RESTAURANT_API}/${req.params.id}/toggle`,
      {},
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

export default router;
