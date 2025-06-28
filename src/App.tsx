import "./App.css";
import DevNav from "@/components/DevNav";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <AuthRoutes />
    </BrowserRouter>
  );
}

export default App;
