import dotenv from "dotenv";
dotenv.config();
import server from "./app.js";

const port = Number(process.env.PORT) || 3001;

server.listen(port, () => {
  console.log(`EstateWork API running at http://localhost:${port}`);
});
