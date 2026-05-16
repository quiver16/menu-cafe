import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [
            process.env.FRONTEND_URL, 
            "http://10.200.100.89:5173", 
            "http://10.200.100.155",
            "http://10.200.100.186:4080", // Agregado el nuevo puerto del frontend
            "https://fc-menu.foodmartcafe.com", // Dominio de producción
            "http://fc-menu.foodmartcafe.com"   // Dominio de producción (HTTP)
        ];

        // Permitir si no hay origin (como herramientas de testeo), 
        // si está en la whitelist, si es localhost o si coincide con la variable de entorno
        if (!origin || 
            origin === 'null' ||
            whiteList.includes(origin) || 
            origin.includes('localhost') || 
            origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            console.log("Origin rejected by CORS:", origin);
            // En lugar de devolver un error que cause un 500, simplemente no permitimos el origin
            callback(null, false);
        }
    },
    credentials: true
}