import express from "express"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import router from "./router"
connectDB();

const app = express();
app.use(express.json())

app.use('/', router)

export default app