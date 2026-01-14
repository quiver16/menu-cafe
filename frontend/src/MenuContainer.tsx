import { useEffect, useState } from "react";
import api from "../config/axios";

interface Categoria {
  _id: string;
  Descripcion: string;
}

interface Producto {
  _id: string;
  Descrip: string;
  Precios: {
    PrecioFinal: number;
  }[];
}

export default function MenuContainer() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategorias(data);
      } catch (error) {
        console.error("No se pudieron cargar las categorías", error);
      }
    };

    fetchCategories();
  }, []);

  const [products, setProducts] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (error) {
        console.error("No se pudieron cargar los productos", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="pb-10">
        <ul className="flex flex-col gap-4 mt-8 mb-10">
          {categorias.map((categoria) => (
            <li
              key={categoria._id}
              className="text-amber-50 flex items-center gap-2"
            >
              <span className="text-amber-500/50 text-4xl font-light">~</span>
              <span className="text-3xl font-['Playball'] tracking-wide hover:text-amber-600 transition-colors cursor-default lowercase first-letter:uppercase">
                {categoria.Descripcion}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col gap-2 rounded-lg border-amber-600 border-2 p-4 bg-white shadow-lg"
            >
              <div className="flex justify-between items-baseline">
                <h2 className="text-2xl font-light text-black ">
                  {product.Descrip}
                </h2>
                <span className="text-xl font-light text-black flex justify-end">
                  ${product.Precios[0]?.PrecioFinal.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
