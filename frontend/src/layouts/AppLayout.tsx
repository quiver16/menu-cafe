import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="bg-amber-900 min-h-screen flex flex-col">
      <header className="w-52 mx-auto pt-10 px-5">
        <img src="src/assets/logo.png" alt="Logotipo de FoodMartCafe" />
      </header>

      <main className=" bg-amber-900 flex-grow container mx-auto max-w-sm px-5">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t-4 border-amber-600 mt-10">
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
