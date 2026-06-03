import type { Meta, StoryObj } from "@storybook/react-vite";
import CommonLoading from "./CommonLoading";

const meta: Meta<typeof CommonLoading> = {
  title: "Components/Common/Loading/CommonLoading",
  component: CommonLoading,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    message: {
      control: "text",
      description: "로딩 메시지 (선택)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    message: "AI가 일정을 생성하고 있어요",
  },
};

export const LongMessage: Story = {
  args: {
    message: "서버에서 데이터를 불러오고 있습니다.\n잠시만 기다려주세요.",
  },
};
