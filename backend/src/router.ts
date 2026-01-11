import { Router } from "express";
import { handleInputErrors } from "./middleware/validation";
import { getProducts } from "./controllers";
import { getCategories } from "./controllers";

const router = Router();

router.get('/products', handleInputErrors, getProducts);
router.get('/categories', handleInputErrors, getCategories);

export default router;
