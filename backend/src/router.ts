import { Router } from "express";
import { handleInputErrors } from "./middleware/validation";
import { getProducts } from "./controllers";
import { getCategories } from "./controllers";
import { getDolar } from "./controllers";
import { getProductImage } from "./controllers";

const router = Router();

router.get('/products', handleInputErrors, getProducts);
router.get('/categories', handleInputErrors, getCategories);
router.get('/dolar', handleInputErrors, getDolar);
router.get('/image/:Codp', handleInputErrors, getProductImage);


export default router;
