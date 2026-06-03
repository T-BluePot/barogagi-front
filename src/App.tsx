import "./App.css";
import { RootRedirect } from "./routes/RootRedirect";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { MainRoutes } from "@/routes/MainRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import GlobalAlertModal from "@/components/common/modal/GlobalAlertModal";
import GlobalConfirmModal from "@/components/common/modal/GlobalConfirmModal";
import GlobalLoading from "@/components/common/loading/GlobalLoading";
import { useFcmForegroundMessage } from "@/hooks/useFcmForegroundMessage";

function App() {
  // 포그라운드 FCM 메시지를 toast로 표시 (앱 생애 1회 구독)
  useFcmForegroundMessage();

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
