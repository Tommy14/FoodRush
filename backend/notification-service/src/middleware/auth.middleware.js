export const verifyInternalKey = (req, res, next) => {
    const key = req.headers['x-internal-api-key'];
  
    if (!key || key !== process.env.INTERNAL_SERVICE_API_KEY) {
      return res.status(403).json({ message: 'Unauthorized access to Notification Service' });
    }
  
    next();
  }
  