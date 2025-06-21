import "./App.css";
import { useState } from "react";
import { CommonTag } from "./components/common/tags/commonTag";
import { SelectTag } from "./components/common/tags/SelectTag";

function App() {
  const [active, setActive] = useState<boolean>(true);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-subtitle text-gray-black bg-main-disable font-bold p-4 rounded-card">
        테스트
      </div>
      <CommonTag
        size="small"
        label="테스트"
        isActive={active}
        onClick={() => setActive(!active)}
      />
      <SelectTag label="테스트2" onClick={() => setActive(!active)} />
      <p className="text-header leading-header tracking-header">제목</p>
    </div>
  );
}

export default App;
