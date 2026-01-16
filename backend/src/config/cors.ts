import { CorsOptions } from "cors";


export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL]
        if (process.argv[2] === "--api") {
            whiteList.push("http://10.200.100.89:5173")
        }

        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            console.log("Origin rejected by CORS:", origin);
            callback(new Error("No permitido"))
        }
    }
}