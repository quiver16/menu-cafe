import { Router } from "express";
import { handleInputErrors } from "./middleware/validation.js";
import { getProducts } from "./controllers/index.js";
import { getCategories } from "./controllers/index.js";
import { getDolar } from "./controllers/index.js";
import { getProductImage } from "./controllers/index.js";

const router = Router();

router.get('/products', handleInputErrors, getProducts);
router.get('/categories', handleInputErrors, getCategories);
router.get('/dolar', handleInputErrors, getDolar);
router.get('/image/:Codp', handleInputErrors, getProductImage);
/*

  location /dolar {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /image {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /products {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /categories {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

*/

export default router;
