import { Request, Response } from "express";
import productosgenerals from "../models/product.js";
import Categoria from "../models/category.js";
import monedas from "../models/currency.js";

export const getProducts = async (req: Request, res: Response) => {

    try {
        const products = await productosgenerals.find({ Categoria: { $exists: true, $ne: "" } }).select({ Descrip: 1, Informacion: 1, Categoria: 1, Precios: { PrecioFinal: 1 }, Codp: 1, ImageFs: 1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Categoria.find({ _id: { $ne: "6814c01d114516e7012011ad" } });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDolar = async (req: Request, res: Response) => {
    try {
       const dolar = await monedas.find({ Codp: "02" });
       res.status(200).json(dolar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
{ Categoria: Categoria }

export const getProductImage = async (req: Request, res: Response) => {
    try {
        const product = await productosgenerals.findOne({ Codp: req.params.Codp });
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.setHeader("Content-Type", "image/png");
        res.send(product.ImageFs?.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}