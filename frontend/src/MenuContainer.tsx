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
  Minus,
  Send,
  Trash2,
} from "lucide-react";

import api from "../config/axios";
import Loader from "./components/Loader";

interface Categoria {
  _id: string;
  Descripcion: string;
  Codp: string;
}

interface Producto {
  _id: string;
  Descrip: string;
  Codp: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const newQuantities = { ...prev };
      if (next === 0) {
        delete newQuantities[productId];
      } else {
        newQuantities[productId] = next;
      }
      return newQuantities;
    });
  };

  const handleSendOrder = () => {
    const orderItems = products
      .filter((p) => quantities[p._id])
      .map((p) => ({
        ...p,
        qty: quantities[p._id],
      }));

    if (orderItems.length === 0) return;

    let message = "*¡Hola! Quisiera realizar el siguiente pedido:*\n\n";
    let total = 0;

    orderItems.forEach((item) => {
      const price = item.Precios[0]?.PrecioFinal || 0;
      const subtotal = price * item.qty;
      message += `• ${item.qty}x ${item.Descrip} - $${subtotal.toFixed(2)}\n`;
      total += subtotal;
    });

    message += `\n*Total: $${total.toFixed(2)}*`;
    message += `\n*Total: Bs: ${(total * dolar).toFixed(2)}*`;

    const phone = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!phone) {
      alert("Número de WhatsApp no configurado en .env.local");
      return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url);
  };

  const clearOrders = () => {
    if (window.confirm("¿Estás seguro de querer borrar toda la orden?")) {
      setQuantities({});
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse, dolarResponse] =
          await Promise.all([
            api.get("/categories"),
            api.get("/products"),
            api.get("/dolar"),
          ]);
        const regexFmc = /\b(FMC|PF)\b/gi;
        const productosLimpios = productsResponse.data.map(
          (product: Producto) => ({
            ...product,
            Descrip: product.Descrip.replace(regexFmc, "").trim(),
          }),
        );
        setCategorias(categoriesResponse.data);
        setProducts(productosLimpios);

        if (dolarResponse.data && dolarResponse.data.length > 0) {
          setDolar(dolarResponse.data[0].Factor);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <Loader />;
  }

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
                          className="flex flex-col gap-3 rounded-2xl border-amber-600/30 border p-5 bg-white shadow-md hover:shadow-xl transition-shadow"
                        >
                          <div className="flex gap-4 items-center">
                            {product.ImageFs && (
                              <div className="shrink-0">
                                <img
                                  src={`${
                                    import.meta.env.VITE_BACKEND_URL
                                  }/image/${product.Codp}`}
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

                          <div className="flex justify-between items-end mt-2">
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-amber-700">
                                ${product.Precios[0]?.PrecioFinal.toFixed(2)}
                              </span>
                              <span className="text-sm font-medium text-amber-700/70">
                                Bs.{" "}
                                {(
                                  product.Precios[0]?.PrecioFinal * dolar
                                ).toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-1 border border-amber-200">
                              <button
                                onClick={() => updateQuantity(product._id, -1)}
                                disabled={!quantities[product._id]}
                                className="p-1 rounded-md hover:bg-amber-200 text-amber-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="w-4 text-center font-bold text-gray-800">
                                {quantities[product._id] || 0}
                              </span>
                              <button
                                onClick={() => updateQuantity(product._id, 1)}
                                className="p-1 rounded-md hover:bg-amber-200 text-amber-700 transition-colors"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="w-[90%] h-px bg-amber-200/20 mt-6" />
          </div>
        );
      })}
      {Object.keys(quantities).length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center gap-4">
          <button
            onClick={clearOrders}
            className="bg-red-500 hover:bg-red-600 text-white font-bold p-3 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
            aria-label="Borrar orden"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendOrder}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span>
              Realizar Pedido ($
              {products
                .reduce(
                  (acc, p) =>
                    acc +
                    (p.Precios[0]?.PrecioFinal || 0) * (quantities[p._id] || 0),
                  0,
                )
                .toFixed(2)}
              )
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
