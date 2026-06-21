import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';


const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`EstateWork API running at http://localhost:${port}`);
});
