import { MemoryRouter, Routes, Route } from "react-router-dom";

import type { Meta, StoryObj } from "@storybook/react-vite";
import BottomTabBar from "./BottomTabBar";
import { TAB_CONFIG, type TabVariant } from "@/constants/tabs";

const tabs = Object.keys(TAB_CONFIG) as TabVariant[];
const firstPath = tabs.length > 0 ? TAB_CONFIG[tabs[0]].path : "/";

const meta: Meta<typeof BottomTabBar> = {
  title: "Components/Common/TabBar/BottomTabBar",
  component: BottomTabBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, ctx) => {
      // story에서 parameters.initialPath로 활성 탭을 제어합니다.
      const initialPath =
        (ctx.parameters as { initialPath?: string })?.initialPath ?? firstPath;

      return (
        <MemoryRouter initialEntries={[initialPath]}>
          {/* NavLink의 isActive 계산을 위해 Routes/Route를 최소 1개 이상 구성 */}
          <Routes>
            {tabs.map((tab) => {
              const { path } = TAB_CONFIG[tab];
              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    <div className="min-h-screen bg-gray-10">
                      <div className="p-6">
                        <div className="text-gray-90">Active Path: {path}</div>
                      </div>

                      {/* 실제 하단 탭바 */}
                      <BottomTabBar />
                    </div>
                  }
                />
              );
            })}

            {/* 혹시 TAB_CONFIG에 없는 경로로 들어왔을 때 대비 */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-10">
                  <div className="p-6 text-gray-90">No matching route</div>
                  <BottomTabBar />
                </div>
              }
            />
          </Routes>

          {/* Story 자체는 Route element에서 렌더링되므로 여기서 추가로 렌더링하지 않습니다. */}
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    initialPath: TAB_CONFIG.home.path,
  },
};
