import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

export default function Footer() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Outlet />
      </div>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-amber-600">
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
            <div className="flex justify-center">
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
