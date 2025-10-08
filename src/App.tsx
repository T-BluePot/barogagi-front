import "./App.css";
import DevNav from "@/components/DevNav";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { MainRoutes } from "@/routes/MainRoutes";
import { BrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <Layout>
        <AuthRoutes />
        <MainRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
