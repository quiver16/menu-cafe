import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CakeSlice,
  Coffee,
  GlassWater,
  CupSoda,
  EggFried,
  UtensilsCrossed,
  Pizza,
  Leaf,
  PlusCircle,
  Milk,
} from "lucide-react";

import api from "../config/axios";

interface Categoria {
  _id: string;
  Descripcion: string;
  Codp: string;
}

interface Producto {
  _id: string;
  Descrip: string;
  Informacion: string;
  Categoria: string;
  ImageFs: string;
  Precios: {
    PrecioFinal: number;
  }[];
}

export default function MenuContainer() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [CategoriaAbierta, setCategoriaAbierta] = useState<string | null>(null);
  const [dolar, setDolar] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse, dolarResponse] =
          await Promise.all([
            api.get("/categories"),
            api.get("/products"),
            api.get("https://ve.dolarapi.com/v1/dolares/oficial"),
          ]);

        const regexFmc = /\b(FMC|PF)\b/gi;
        const productosLimpios = productsResponse.data.map(
          (product: Producto) => ({
            ...product,
            Descrip: product.Descrip.replace(regexFmc, "").trim(),
          })
        );
        setCategorias(categoriesResponse.data);
        setProducts(productosLimpios);
        setDolar(dolarResponse.data.promedio);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (CategoriaAbierta) {
      const element = document.getElementById(CategoriaAbierta);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 350);
      }
    }
  }, [CategoriaAbierta]);

  const toggleCategoria = (categoriaId: string) => {
    setCategoriaAbierta(categoriaId === CategoriaAbierta ? null : categoriaId);
  };

  const getCategoryIcon = (descripcion: string) => {
    if (descripcion.includes("POSTRES")) return <CakeSlice />;
    if (descripcion.includes("CAFES")) return <Coffee />;
    if (descripcion.includes("BEBIDAS")) return <GlassWater />;
    if (descripcion.includes("JUGOS")) return <CupSoda />;
    if (descripcion.includes("DESAYUNOS")) return <EggFried />;
    if (descripcion.includes("ALMUERZOS")) return <UtensilsCrossed />;
    if (descripcion.includes("COMIDA RAPIDA")) return <Pizza />;
    if (descripcion.includes("TE NATURAL")) return <Leaf />;
    if (descripcion.includes("ADICIONALES")) return <PlusCircle />;
    if (descripcion.includes("BATIDOS")) return <Milk />;
    return <UtensilsCrossed />;
  };
  return (
    <div className="pb-10 px-4 pt-8">
      {categorias.map((categoria) => {
        CategoriaAbierta === categoria._id;
        return (
          <div
            key={categoria._id}
            id={categoria._id}
            className="scroll-mt-4 mb-12"
          >
            <button
              onClick={() => toggleCategoria(categoria._id)}
              className="w-full text-amber-50 flex items-center justify-between gap-4 mb-6 hover:cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-amber-500/80 group-hover:text-amber-400 transition-colors">
                  {getCategoryIcon(categoria.Descripcion)}
                </div>
                <span className="text-3xl font-[poppins] font-bold tracking-wide text-left">
                  {categoria.Descripcion}
                </span>
              </div>

              <div className="text-amber-500/50 group-hover:text-amber-400 transition-colors">
                {CategoriaAbierta === categoria._id ? (
                  <ChevronUp className="w-8 h-8" />
                ) : (
                  <ChevronDown className="w-8 h-8" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {CategoriaAbierta === categoria._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-6 pb-6">
                    {products
                      .filter((product) => product.Categoria === categoria.Codp)
                      .map((product) => (
                        <div
                          key={product._id}
                          className="flex flex-col gap-3 rounded-xl border-amber-600/30 border p-5 bg-white shadow-md hover:shadow-xl transition-shadow"
                        >
                          <div className="flex gap-4 items-center">
                            {product.ImageFs && (
                              <div className="shrink-0">
                                <img
                                  src={`data:image/png;base64,${product.ImageFs}`}
                                  alt={product.Descrip}
                                  loading="lazy"
                                  className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                />
                              </div>
                            )}
                            <div className="flex flex-col gap-1 flex-1">
                              <h2 className="text-xl font-medium text-gray-900">
                                {product.Descrip}
                              </h2>
                            </div>
                          </div>
                          {product.Informacion && (
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {product.Informacion}
                            </p>
                          )}

                          <div className="flex justify-between items-baseline mt-1">
                            <span className="text-xl font-bold text-amber-700">
                              ${product.Precios[0]?.PrecioFinal.toFixed(2)}
                            </span>
                            <span className="text-xl font-bold text-amber-700">
                              Bs.{" "}
                              {(
                                product.Precios[0]?.PrecioFinal * dolar
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
