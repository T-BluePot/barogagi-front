import type { Meta, StoryObj } from "@storybook/react-vite";
import TextButton from "./TextButton";

const meta: Meta<typeof TextButton> = {
  title: "Components/Common/Buttons/TextButton",
  component: TextButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Default: Story = {
  args: {
    label: "일정 다시 등록하기",
  },
};

export const LongLabel: Story = {
  args: {
    label:
      "이것은 매우 긴 텍스트 버튼입니다. 단어 단위로 줄바꿈이 잘 되는지 확인하세요!",
  },
};
