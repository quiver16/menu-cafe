import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Footer />}>
                    <Route path="/" element={<Header />}>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
