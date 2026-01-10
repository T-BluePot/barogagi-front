import "./App.css";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { MainRoutes } from "@/routes/MainRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<MainRoutes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
