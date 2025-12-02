import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from "./PageTitle";

const meta = {
  title: "Components/Auth/Common/PageTitle",
  component: PageTitle,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "auth",
      values: [
        {
          name: "auth",
          value: "#111827",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["auth", "main"],
    },
    title: {
      control: "text",
    },
    subTitle: {
      control: "text",
    },
  },
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuthTypeDefault: Story = {
  args: {
    type: "auth",
    title: "로그인",
    subTitle: "간편하게 로그인하고\n다양한 서비스를 이용해보세요",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const AuthTypeWithoutSubtitle: Story = {
  args: {
    type: "auth",
    title: "회원가입",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const MainTypeDefault: Story = {
  args: {
    type: "main",
    title: "프로필 설정",
    subTitle: "개인정보를 입력해주세요",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-white">
        <Story />
      </div>
    ),
  ],
};

export const MainTypeWithoutSubtitle: Story = {
  args: {
    type: "main",
    title: "설정",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-white">
        <Story />
      </div>
    ),
  ],
};

export const LongTitle: Story = {
  args: {
    type: "auth",
    title: "매우 긴 제목입니다.\n여러 줄에 걸쳐 표시됩니다.",
    subTitle: "이것도 긴 부제목입니다.\n여러 줄로 표시될 수 있습니다.",
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-6 bg-gray-900">
        <Story />
      </div>
    ),
  ],
};

export const Comparison: Story = {
  args: {
    type: "auth",
    title: "로그인",
    subTitle: "간편하게 로그인하고\n다양한 서비스를 이용해보세요",
  },
  render: () => (
    <div className="space-y-8">
      <div className="w-96 p-6 bg-gray-900 rounded-lg">
        <h3 className="text-white mb-4 text-sm">Auth Type</h3>
        <PageTitle
          type="auth"
          title="로그인"
          subTitle="간편하게 로그인하고\n다양한 서비스를 이용해보세요"
        />
      </div>
      <div className="w-96 p-6 bg-white border rounded-lg">
        <h3 className="text-gray-900 mb-4 text-sm">Main Type</h3>
        <PageTitle
          type="main"
          title="프로필 설정"
          subTitle="개인정보를 입력해주세요"
        />
      </div>
    </div>
  ),
};
