import type { Meta, StoryObj } from "@storybook/react-vite";
import SectionSpacer from "./SectionSpacer";

/**
 * SectionSpacer Storybook 설정
 * 단순한 레이아웃 구분 영역을 확인하기 위한 스토리입니다.
 */
const meta: Meta<typeof SectionSpacer> = {
  title: "Components/Common/Layout/SectionSpacer",
  component: SectionSpacer,
};

export default meta;
type Story = StoryObj<typeof SectionSpacer>;

/**
 * 기본 Spacer (h-3)
 */
export const Default: Story = {
  render: () => (
    <div className="w-full border border-gray-30 p-4">
      <p>위 영역</p>
      <SectionSpacer />
      <p>아래 영역</p>
    </div>
  ),
};

/**
 * h-2 버전 예시
 */
export const Small: Story = {
  render: () => (
    <div className="w-full border border-gray-30 p-4">
      <p>위 영역</p>
      <div className="w-full h-2 bg-gray-5" />
      <p>아래 영역</p>
    </div>
  ),
};

/**
 * h-4 버전 예시
 */
export const Large: Story = {
  render: () => (
    <div className="w-full border border-gray-30 p-4">
      <p>위 영역</p>
      <div className="w-full h-4 bg-gray-5" />
      <p>아래 영역</p>
    </div>
  ),
};
