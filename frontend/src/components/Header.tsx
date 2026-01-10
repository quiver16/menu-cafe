import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function Header() {
  return (
    <>
      <div className="bg-amber-800 min-h-screen">
        <div className="max-w-lg mx-auto pt-10 px-5">
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
