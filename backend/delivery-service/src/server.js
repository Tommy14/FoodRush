import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // Load environment variables

const PORT = process.env.DELIVERY_PORT || 9300;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
