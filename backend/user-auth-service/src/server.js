import dotenv from "dotenv";
import app from "./app.js";


dotenv.config(); // Load environment variables

const PORT = process.env.USER_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
