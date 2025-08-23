import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TabMenuBar from "@/components/common/tab-menu/TabManuBar";
import type { TabItem } from "@/components/common/tab-menu/TabManuBar";
import IdFindContent from "@/components/auth/find/IdFindContent";
import PwFindContent from "@/components/auth/find/PwFindContent";

const AccountFindPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("id");

  const tabs: TabItem[] = [
    { id: "id", label: "아이디 찾기" },
    { id: "password", label: "비밀번호 재설정" },
  ];

  // URL query parameter에 따라 초기 탭 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "password") {
      setActiveTab("password");
    } else {
      setActiveTab("id");
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // URL query parameter 업데이트
    setSearchParams({ tab: tabId });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "id":
        return <IdFindContent />;
      case "password":
        return <PwFindContent />;
      default:
        return <IdFindContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Tab Menu */}
      <div className="px-4">
        <TabMenuBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-6">{renderContent()}</div>
    </div>
  );
};

export default AccountFindPage;
