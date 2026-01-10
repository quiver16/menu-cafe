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
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                                <img src="src/assets/logo.png" className="w-40" alt="Logotipo de FoodMartCafe" />
                            </h2>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 flex justify-center">
                                © {new Date().getFullYear()} AlphaSoft. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
            <Toaster />
        </div>
    );
}
