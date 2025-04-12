import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // Load environment variables

const PORT = process.env.RESTAURANT_PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
