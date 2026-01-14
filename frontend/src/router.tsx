import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuContainer from "./MenuContainer";
import AppLayout from "./layouts/AppLayout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MenuContainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
