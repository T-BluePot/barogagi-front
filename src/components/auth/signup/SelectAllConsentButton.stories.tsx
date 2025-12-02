import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectAllConsentButton } from "./SelectAllConsentButton";

const meta = {
  title: "Components/Auth/Signup/SelectAllConsentButton",
  component: SelectAllConsentButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "auth",
      values: [
        {
          name: "auth",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
    },
    isChecked: {
      control: "boolean",
    },
  },
  args: {
    onCheckedChange: () => console.log("onCheckedChange"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectAllConsentButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "모두 동의하기",
    isChecked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "모두 동의하기",
    isChecked: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: "모든 이용약관 및 개인정보 처리방침에 동의합니다",
    isChecked: false,
  },
};
