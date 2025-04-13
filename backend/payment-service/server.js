import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 9400;

app.listen(PORT, () => {
  console.log(`Payment Service is running on port ${PORT}`);
});
