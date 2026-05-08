import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
  type ReactElement,
} from "react";
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

// ── Mapa de iconos por keyword ─────────────────────────────────────────────────
// Definido fuera del componente: se crea una sola vez, nunca se recrea.
const ICON_MAP: [string, ReactElement][] = [
  ["POSTRES", <CakeSlice key="postres" />],
  ["CAFES", <Coffee key="cafes" />],
  ["BEBIDAS", <GlassWater key="bebidas" />],
  ["JUGOS", <CupSoda key="jugos" />],
  ["DESAYUNOS", <EggFried key="desayunos" />],
  ["ALMUERZOS", <UtensilsCrossed key="almuerzos" />],
  ["COMIDA RAPIDA", <Pizza key="comida" />],
  ["TE NATURAL", <Leaf key="te" />],
  ["ADICIONALES", <PlusCircle key="adicionales" />],
  ["BATIDOS", <Milk key="batidos" />],
];
const ICON_DEFAULT = <UtensilsCrossed key="default" />;

function getCategoryIcon(descripcion: string) {
  for (const [k, icon] of ICON_MAP) {
    if (descripcion.includes(k)) return icon;
  }
  return ICON_DEFAULT;
}

// ── ProductCard: componente memoizado, solo re-renderiza si cambia qty ─────────
const ProductCard = memo(function ProductCard({
  product,
  qty,
  dolar,
  onIncrease,
  onDecrease,
  backendUrl,
}: {
  product: Producto;
  qty: number;
  dolar: number;
  onIncrease: () => void;
  onDecrease: () => void;
  backendUrl: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-amber-600/30 border p-5 bg-white shadow-md hover:shadow-xl transition-shadow">
      <div className="flex gap-4 items-center">
        {product.ImageFs && (
          <div className="shrink-0">
            <img
              src={`${backendUrl}/image/${product.Codp}`}
              alt={product.Descrip}
              loading="lazy"
              decoding="async"
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
            Bs. {(product.Precios[0]?.PrecioFinal * dolar).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-1 border border-amber-200">
          <button
            onClick={onDecrease}
            disabled={!qty}
            className="p-1 rounded-md hover:bg-amber-200 text-amber-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="w-4 text-center font-bold text-gray-800">
            {qty || 0}
          </span>
          <button
            onClick={onIncrease}
            className="p-1 rounded-md hover:bg-amber-200 text-amber-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────

export default function MenuContainer() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [CategoriaAbierta, setCategoriaAbierta] = useState<string | null>(null);
  const [dolar, setDolar] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  // ── Productos agrupados por Codp de categoría (una sola vez al cargar) ──────
  const productsByCategory = useMemo(() => {
    const map = new Map<string, Producto[]>();
    for (const p of products) {
      const arr = map.get(p.Categoria) ?? [];
      arr.push(p);
      map.set(p.Categoria, arr);
    }
    return map;
  }, [products]);

  // ── Codp de la categoría actualmente abierta (evita .find() en el render) ──
  const openCodp = useMemo(
    () => categorias.find((c) => c._id === CategoriaAbierta)?.Codp ?? null,
    [categorias, CategoriaAbierta],
  );

  // ── Total del pedido calculado con useMemo ───────────────────────────────────
  const orderTotal = useMemo(
    () =>
      products.reduce(
        (acc, p) =>
          acc + (p.Precios[0]?.PrecioFinal || 0) * (quantities[p._id] || 0),
        0,
      ),
    [products, quantities],
  );

  const updateQuantity = useCallback((productId: string, delta: number) => {
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
  }, []);

  const handleSendOrder = useCallback(() => {
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
      const subtotalBs = subtotal * dolar;
      message += `*${item.Descrip}*\n`;
      message += `Cantidad: ${item.qty}\n`;
      message += `Total: ${Math.round(subtotalBs)}Bs\n`;
      message += `Total ($): ${subtotal.toFixed(2)}\n\n`;
      total += subtotal;
    });

    message += `*TOTAL DEL PEDIDO*\n`;
    message += `*Total ($): ${total.toFixed(2)}*\n`;
    message += `*Total: ${Math.round(total * dolar)}Bs*\n`;

    const phone = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!phone) {
      alert("Número de WhatsApp no configurado en .env.local");
      return;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url);
  }, [products, quantities, dolar]);

  const clearOrders = useCallback(() => {
    if (window.confirm("¿Estás seguro de querer borrar toda la orden?")) {
      setQuantities({});
    }
  }, []);

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

  const toggleCategoria = useCallback((categoriaId: string) => {
    setCategoriaAbierta((prev) => (categoriaId === prev ? null : categoriaId));
  }, []);

  if (loading) {
    return <Loader />;
  }

  /* ── helper: card de categoría para móvil (acordeón) ── */
  const renderCategoria = (categoria: Categoria) => {
    const categoryProducts = productsByCategory.get(categoria.Codp) ?? [];
    return (
      <div key={categoria._id} id={categoria._id} className="scroll-mt-4 mb-12">
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
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    qty={quantities[product._id] || 0}
                    dolar={dolar}
                    backendUrl={backendUrl}
                    onIncrease={() => updateQuantity(product._id, 1)}
                    onDecrease={() => updateQuantity(product._id, -1)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-[90%] h-px bg-amber-200/20 mt-6" />
      </div>
    );
  };

  /* ── helper: sólo el header de la categoría (desktop) ── */
  const renderCategoriaHeader = (categoria: Categoria) => (
    <div key={categoria._id} id={categoria._id} className="scroll-mt-4 mb-8">
      <button
        onClick={() => toggleCategoria(categoria._id)}
        className={`w-full text-amber-50 flex items-center justify-between gap-4 mb-4 hover:cursor-pointer group transition-colors ${
          CategoriaAbierta === categoria._id ? "text-amber-400" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`transition-colors ${
              CategoriaAbierta === categoria._id
                ? "text-amber-400"
                : "text-amber-500/80 group-hover:text-amber-400"
            }`}
          >
            {getCategoryIcon(categoria.Descripcion)}
          </div>
          <span className="text-2xl font-[poppins] font-bold tracking-wide text-left">
            {categoria.Descripcion}
          </span>
        </div>
        <div
          className={`transition-colors ${
            CategoriaAbierta === categoria._id
              ? "text-amber-400"
              : "text-amber-500/50 group-hover:text-amber-400"
          }`}
        >
          {CategoriaAbierta === categoria._id ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </div>
      </button>
      <div className="w-full h-px bg-amber-200/20" />
    </div>
  );

  const openProducts = openCodp ? (productsByCategory.get(openCodp) ?? []) : [];

  return (
    <div className="pb-10 px-4 pt-8 lg:px-12 lg:max-w-7xl lg:mx-auto">
      {/* ── MÓVIL: acordeón ── */}
      <div className="lg:hidden">{categorias.map(renderCategoria)}</div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:block">
        {/* Grid de headers de 3 columnas */}
        <div className="grid grid-cols-3 gap-x-10 mb-4">
          {categorias.map(renderCategoriaHeader)}
        </div>

        {/* Sección full-width de productos de la categoría abierta */}
        <AnimatePresence>
          {CategoriaAbierta && (
            <motion.div
              key={CategoriaAbierta}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 py-6">
                {openProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    qty={quantities[product._id] || 0}
                    dolar={dolar}
                    backendUrl={backendUrl}
                    onIncrease={() => updateQuantity(product._id, 1)}
                    onDecrease={() => updateQuantity(product._id, -1)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
            <span>Realizar Pedido (${orderTotal.toFixed(2)})</span>
          </button>
        </div>
      )}
    </div>
  );
}
