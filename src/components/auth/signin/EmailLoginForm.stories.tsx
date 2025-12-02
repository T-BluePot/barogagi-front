import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { EmailLoginForm } from "./EmailLoginForm";

const meta = {
  title: "Components/Auth/Signin/EmailLoginForm",
  component: EmailLoginForm,
  parameters: {
    layout: "fullscreen",
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
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="min-h-screen bg-gray-900 p-6">
          <div className="max-w-md mx-auto">
            <Story />
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof EmailLoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTitle: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto space-y-12">
          <div className="space-y-3">
            <h1 className="typo-title-01 text-white">로그인</h1>
            <p className="typo-body text-gray-20">
              간편하게 로그인하고
              <br />
              다양한 서비스를 이용해보세요
            </p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
