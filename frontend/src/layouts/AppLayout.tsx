import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import bgImage from "../assets/fondo1.png";
import headerImg from "../assets/header.jpg";

export default function AppLayout() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed position-fixed"
      style={{
        backgroundImage: `linear-gradient(
          rgba(0, 0, 0, 0.4),
          rgba(0, 0, 0, 0.4)
        ),
        url(${bgImage})`,
      }}
    >
      <header className="w-full">
        <div className="w-full h-32 overflow-hidden relative shadow-lg">
          <img
            src={headerImg}
            alt="Header FoodMart"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="w-52 mx-auto -mt-20 relative z-10 px-5">
          <img
            src="src/assets/logo.png"
            alt="Logotipo de FoodMartCafe"
            className="drop-shadow-xl"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-sm px-5">
        <Outlet />
      </main>

      <footer className="bg-slate-700 text-slate-300 py-12 border-t-4 border-amber-600 mt-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div>
            <div className="flex items-center space-x-4">
              <a href="https://alphasoft.com.ve/" target="_blank">
                <img
                  src="src/assets/logo-alpha.png"
                  className="w-60"
                  alt="Logotipo de AlphaSoft"
                />
              </a>
              <a href="https://www.foodmartcafe.com" target="_blank">
                <img
                  src="src/assets/logo.png"
                  className="w-40"
                  alt="Logotipo de FoodMartCafe"
                />
              </a>
            </div>
            <div className="flex justify-center mt-4">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} AlphaSoft. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
