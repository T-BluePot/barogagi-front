import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { CheckBoxButton } from "./CheckBoxButton";

const meta = {
  title: "Auth/Signup/CheckBoxButton",
  component: CheckBoxButton,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    isChecked: { control: "boolean" },
    label: { control: "text" },
  },
} satisfies Meta<typeof CheckBoxButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "large",
    isChecked: false,
    onCheckedChange: action("isChecked"),
    label: "전체 동의하기",
  },
};

export const Skip: Story = {
  args: {
    gap: "tight",
    isChecked: false,
    onCheckedChange: action("isChecked"),
    label: "다음에 입력할게요.",
    labelColor: "gray",
  },
};
