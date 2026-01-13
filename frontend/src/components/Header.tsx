import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import api from "../../config/axios";

const CategoriesList = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("No se pudieron cargar las categorías", error);
      }
    };

    fetchCategories();
  }, []);
}


export default function Header() {
  return (
    <>
      <div className="bg-amber-800 min-h-screen">
        <div className="max-w-sm mx-auto pt-10 px-5">
          <img src="src/assets/logo.png" alt="Logotipo de FoodMartCafe" />
          <div className="py-10">
            <Outlet />
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
