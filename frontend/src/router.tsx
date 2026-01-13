import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuContainer from "./MenuContainer";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Footer />}>
          <Route path="/" element={<Header />}>
            <Route index element={<MenuContainer />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
