import app from './src/app.js';

const PORT = process.env.PORT || 9600;

app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`);
});
