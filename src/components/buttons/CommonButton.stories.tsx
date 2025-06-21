import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./CommonButton";
import IconBox from "@/components/common/IconBox";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: "Default Button",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Icon 포함 버튼",
    icon: <IconBox name="home" width={24} height={24} />,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Button",
    isDisabled: true,
  },
};
