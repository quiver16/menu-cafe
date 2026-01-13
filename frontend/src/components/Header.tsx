import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import api from "../../config/axios";

interface Categoria {
  _id: string;
  Descripcion: string;
}

export default function Header() {
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

  return (
    <>
      <div className="bg-amber-800 min-h-screen">
        <div className="max-w-sm mx-auto pt-10 px-5">
          <img src="src/assets/logo.png" alt="Logotipo de FoodMartCafe" />

          <ul className="flex flex-col gap-2">
            {categorias.map((categoria) => (
              <li
                key={categoria._id}
                className="text-white lowercase first-letter:uppercase text-2xl font-medium"
              >
                {categoria.Descripcion}
              </li>
            ))}
          </ul>

          <div className="py-10">
            <Outlet />
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
