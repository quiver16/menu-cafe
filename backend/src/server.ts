import express from "express"
import 'dotenv/config'
import cors from "cors"
import { connectDB } from "./config/db.js"
import { corsConfig } from "./config/cors.js"
import router from "./router"
connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json())

app.use('/', router)

export default app