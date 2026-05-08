import { Request, Response } from "express";
import crypto from "crypto";
import productosgenerals from "../models/product.js";
import Categoria from "../models/category.js";
import monedas from "../models/currency.js";

// ── Caché en memoria para imágenes de productos ──────────────────────────────
// Evita consultar MongoDB repetidamente por la misma imagen.
// Se limita a 200 entradas para no saturar la RAM.
const IMAGE_CACHE_MAX = 200;
const imageCache = new Map<string, { data: Buffer; etag: string }>();

function addToImageCache(codp: string, data: Buffer): string {
    if (imageCache.size >= IMAGE_CACHE_MAX) {
        // Elimina la entrada más antigua (primera clave del Map)
        const firstKey = Array.from(imageCache.keys())[0];
        if (firstKey !== undefined) imageCache.delete(firstKey);
    }
    const etag = crypto.createHash("md5").update(data).digest("hex");
    imageCache.set(codp, { data, etag });
    return etag;
}
// ─────────────────────────────────────────────────────────────────────────────

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productosgenerals.find({ Categoria: { $exists: true, $ne: "" } }).select({ Descrip: 1, Informacion: 1, Categoria: 1, Precios: { PrecioFinal: 1 }, Codp: 1, ImageFs: 1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Categoria.find({ _id: { $ne: "6814c01d114516e7012011ad" } });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

export const getDolar = async (req: Request, res: Response) => {
    try {
       const dolar = await monedas.find({ Codp: "02" });
       res.status(200).json(dolar);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

export const getProductImage = async (req: Request, res: Response) => {
    try {
        const codp = req.params.Codp as string;

        // 1. Intentar servir desde caché en memoria
        let cached = imageCache.get(codp);

        if (!cached) {
            // 2. Solo consultar MongoDB si no está en caché
            const product = await productosgenerals.findOne({ Codp: codp }).select({ ImageFs: 1 });
            if (!product || !product.ImageFs?.data) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            const buf = Buffer.from(product.ImageFs.data);
            const etag = addToImageCache(codp, buf);
            cached = { data: buf, etag };
        }

        // 3. ETag — responder 304 si el cliente ya tiene la versión actual
        const rawEtag = req.headers["if-none-match"];
        const clientEtag = Array.isArray(rawEtag) ? rawEtag[0] : rawEtag;
        if (clientEtag === cached.etag) {
            return res.status(304).end();
        }

        // 4. Enviar imagen con headers de caché (1 día)
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setHeader("ETag", cached.etag);
        res.send(cached.data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}