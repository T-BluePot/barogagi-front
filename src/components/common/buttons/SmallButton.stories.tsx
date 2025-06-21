import type { Meta, StoryObj } from "@storybook/react-vite";
import SmallButton from "./SmallButton";

const meta: Meta<typeof SmallButton> = {
  title: "Components/SmallButton",
  component: SmallButton,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["filled", "outlined"],
      description: "버튼의 스타일 타입",
    },
    isDisabled: {
      control: "boolean",
      description: "버튼의 비활성화 상태",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SmallButton>;

export const Filled: Story = {
  args: {
    label: "중복 확인",
    type: "filled",
  },
};

export const Outlined: Story = {
  args: {
    label: "중복 확인",
    type: "outlined",
  },
};

export const FilledDisabled: Story = {
  args: {
    label: "중복 확인",
    type: "filled",
    isDisabled: true,
  },
};

export const OutlinedDisabled: Story = {
  args: {
    label: "중복 확인",
    type: "outlined",
    isDisabled: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: "이것은 매우 긴 텍스트가 있는 작은 버튼입니다",
    type: "filled",
  },
};
