import { CorsOptions } from "cors";


export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL, "http://10.200.100.89:5173"]

        // Permitir si no hay origin (archivos locales), si está en la whitelist, 
        // si es origin 'null', o si es cualquier variante de localhost
        if (!origin || 
            whiteList.includes(origin) || 
            origin === 'null' || 
            origin.includes('localhost') || 
            origin.includes('127.0.0.1')) {
            callback(null, true)
        } else {
            console.log("Origin rejected by CORS:", origin);
            callback(new Error("No permitido"))
        }
    }
}