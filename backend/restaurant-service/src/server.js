import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // Load environment variables

const PORT = process.env.RESTAURANT_PORT || 9100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
