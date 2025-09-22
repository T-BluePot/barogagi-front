import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TabMenuBar from "./TabManuBar";
import type { TabItem } from "./TabManuBar";

const meta = {
  title: "Components/Common/TabMenuBar",
  component: TabMenuBar,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TabMenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리 - 인터랙티브하게 동작
const TabMenuBarWithState = ({ tabs }: { tabs: TabItem[] }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  return (
    <div className="w-80 bg-gray-900 p-4 rounded-lg">
      <TabMenuBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mt-4 p-4 bg-gray-800 rounded">
        <p className="text-white text-sm">
          현재 활성 탭: <span className="text-lime-400 font-semibold">{activeTab}</span>
        </p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <TabMenuBarWithState
      tabs={[
        { id: "tab1", label: "첫 번째 탭" },
        { id: "tab2", label: "두 번째 탭" },
        { id: "tab3", label: "세 번째 탭" },
      ]}
    />
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <TabMenuBarWithState
      tabs={[
        { id: "id", label: "아이디 찾기" },
        { id: "password", label: "비밀번호 재설정" },
      ]}
    />
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <TabMenuBarWithState
      tabs={[
        { id: "home", label: "홈" },
        { id: "profile", label: "프로필" },
        { id: "settings", label: "설정" },
        { id: "notifications", label: "알림" },
        { id: "help", label: "도움말" },
      ]}
    />
  ),
};

export const LongLabels: Story = {
  render: () => (
    <TabMenuBarWithState
      tabs={[
        { id: "very-long-tab-1", label: "매우 긴 탭 제목 첫 번째" },
        { id: "very-long-tab-2", label: "매우 긴 탭 제목 두 번째" },
      ]}
    />
  ),
};

export const SingleTab: Story = {
  render: () => (
    <TabMenuBarWithState
      tabs={[
        { id: "only", label: "유일한 탭" },
      ]}
    />
  ),
};

// 정적 상태들
export const FirstTabActive: Story = {
  args: {
    tabs: [
      { id: "tab1", label: "활성 탭" },
      { id: "tab2", label: "비활성 탭" },
      { id: "tab3", label: "비활성 탭" },
    ],
    activeTab: "tab1",
    onTabChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-gray-900 p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const SecondTabActive: Story = {
  args: {
    tabs: [
      { id: "tab1", label: "비활성 탭" },
      { id: "tab2", label: "활성 탭" },
      { id: "tab3", label: "비활성 탭" },
    ],
    activeTab: "tab2",
    onTabChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-gray-900 p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const ThirdTabActive: Story = {
  args: {
    tabs: [
      { id: "tab1", label: "비활성 탭" },
      { id: "tab2", label: "비활성 탭" },
      { id: "tab3", label: "활성 탭" },
    ],
    activeTab: "tab3",
    onTabChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-gray-900 p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
