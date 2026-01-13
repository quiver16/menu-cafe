import { Toaster } from "sonner";

export default function Header() {
  return (
    <>
      <div className="bg-amber-900 min-h-screen">
        <div className="max-w-sm mx-auto pt-10 px-5">
          <img src="src/assets/logo.png" alt="Logotipo de FoodMartCafe" />
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
