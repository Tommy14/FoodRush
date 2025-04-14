import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 9800;

app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`);
});
