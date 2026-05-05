import "./App.css";
import { RootRedirect } from "./routes/RootRedirect";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { MainRoutes } from "@/routes/MainRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import GlobalAlertModal from "@/components/common/modal/GlobalAlertModal";
import GlobalConfirmModal from "@/components/common/modal/GlobalConfirmModal";
import GlobalLoading from "@/components/common/loading/GlobalLoading";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<MainRoutes />} />
        </Routes>
      </Layout>
      <GlobalAlertModal />
      <GlobalConfirmModal />
      <GlobalLoading />
    </BrowserRouter>
  );
}

export default App;
