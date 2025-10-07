import type { Meta, StoryObj } from "@storybook/react-vite";
import { TermsConsentItem } from "./TermsConsentItem";

const meta = {
  title: "Components/Auth/Signup/TermsConsentItem",
  component: TermsConsentItem,
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
    id: {
      control: "text",
    },
    label: {
      control: "text",
    },
    isConsented: {
      control: "boolean",
    },
  },
  args: {
    onToggle: () => console.log("onToggle"),
    onOpenDetail: () => console.log("onOpenDetail"),
  },
} satisfies Meta<typeof TermsConsentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = {
  args: {
    id: "privacy",
    label: "개인정보 처리방침 (필수)",
    isConsented: false,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const RequiredChecked: Story = {
  args: {
    id: "privacy",
    label: "개인정보 처리방침 (필수)",
    isConsented: true,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const Optional: Story = {
  args: {
    id: "marketing",
    label: "마케팅 수신 동의 (선택)",
    isConsented: false,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const OptionalChecked: Story = {
  args: {
    id: "marketing",
    label: "마케팅 수신 동의 (선택)",
    isConsented: true,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const LongLabel: Story = {
  args: {
    id: "terms",
    label: "바로가기 서비스 이용약관 및 개인정보 처리방침 동의 (필수)",
    isConsented: false,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const Multiple: Story = {
  args: {
    id: "terms",
    label: "이용약관 (필수)",
    isConsented: true,
  },
  render: () => {
    const handleToggle = () => console.log("onToggle");
    const handleOpenDetail = () => console.log("onOpenDetail");

    return (
      <div className="w-96 p-6 bg-gray-900 space-y-4">
        <TermsConsentItem
          id="terms"
          label="이용약관 (필수)"
          isConsented={true}
          onToggle={handleToggle}
          onOpenDetail={handleOpenDetail}
        />
        <TermsConsentItem
          id="privacy"
          label="개인정보 처리방침 (필수)"
          isConsented={true}
          onToggle={handleToggle}
          onOpenDetail={handleOpenDetail}
        />
        <TermsConsentItem
          id="marketing"
          label="마케팅 수신 동의 (선택)"
          isConsented={false}
          onToggle={handleToggle}
          onOpenDetail={handleOpenDetail}
        />
      </div>
    );
  },
};
