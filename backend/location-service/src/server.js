import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); 

const PORT = process.env.LOCATION_PORT || 9500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
