import "./App.css";
import DevNav from "@/components/DevNav";
import { AuthRoutes } from "@/routes/AuthRoutes";

function App() {
  return (
    <>
      <DevNav />
      <AuthRoutes />
    </>
  );
}

export default App;
