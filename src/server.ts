import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { env } from "./utils/envValidator";

const PORT = env.PORT || 5000;
 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
    