import React, { useEffect, useRef, useState } from "react";

// Tab 항목의 데이터 구조를 정의합니다.
// 향후 아이콘, 비활성화 상태 등을 추가할 수 있도록 확장성을 고려합니다.
export interface TabItem {
  id: string;
  label: string;
}

// TabMenu 컴포넌트가 받을 props 타입을 정의합니다.
interface TabMenuProps {
  /** 탭 데이터 배열 */
  tabs: TabItem[];
  /** 현재 활성화된 탭의 id */
  activeTab: string;
  /** 탭 변경 시 호출될 콜백 함수 */
  onTabChange: (tabId: string) => void;
}

/**
 * @description 공용 탭 메뉴 UI 컴포넌트
 * @param {TabItem[]} tabs - 탭에 표시될 데이터 배열
 * @param {string} activeTab - 현재 활성화된 탭의 id
 * @param {(tabId: string) => void} onTabChange - 탭 클릭 시 상태를 변경하는 함수
 */
const TabMenuBar: React.FC<TabMenuProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

  // 활성 탭이 변경될 때마다 인디케이터 위치와 크기 업데이트
  useEffect(() => {
    if (!containerRef.current) return;

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (activeIndex === -1) return;

    // 인디케이터 다음에 있는 버튼들을 찾아야 함 (인디케이터가 첫 번째 자식이므로)
    const activeButton = containerRef.current.children[
      activeIndex + 1 // 인디케이터 다음부터가 실제 버튼들
    ] as HTMLButtonElement;

    if (activeButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  }, [activeTab, tabs]);

  return (
    // 시맨틱 태그와 ARIA role을 사용하여 웹 접근성을 준수합니다.
    <div
      role="tablist"
      className="relative flex border-b border-gray-700"
      ref={containerRef}
    >
      {/* 애니메이션 인디케이터 */}
      <div
        className="absolute bottom-0 h-0.5 bg-lime-400 transition-all duration-300 ease-in-out"
        style={{
          width: `${indicatorStyle.width}px`,
          transform: `translateX(${indicatorStyle.left}px)`,
        }}
      />

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`} // 각 탭이 제어할 패널의 id를 명시 (접근성)
            onClick={() => onTabChange(tab.id)}
            // Tailwind CSS를 사용해 조건부 스타일링을 적용합니다.
            // 가독성을 위해 여러 줄로 분리했습니다.
            className={`
              flex-1 py-3 text-center text-base font-medium transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400
              ${
                isActive
                  ? "text-white" // 활성 탭 스타일 (border는 애니메이션 인디케이터로 대체)
                  : "text-gray-400 hover:text-gray-200" // 비활성 탭 스타일
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabMenuBar;
