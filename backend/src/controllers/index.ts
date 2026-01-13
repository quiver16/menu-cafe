import { Request, Response } from "express";
import productosgenerals from "../models/product";
import Categoria from "../models/category";

export const getProducts = async (req: Request, res: Response) => {

    try {
        const products = await productosgenerals.find({ Categoria: { $exists: true, $ne: "" } }).select({ Descrip: 1, Precios: { PrecioFinal: 1 } });
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


{ Categoria: Categoria }