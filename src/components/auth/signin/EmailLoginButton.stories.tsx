import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { EmailLoginButton } from "./EmailLoginButton";

const meta = {
  title: "Components/Auth/Signin/EmailLoginButton",
  component: EmailLoginButton,
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
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-96 p-6 bg-gray-900">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof EmailLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContext: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-96 p-6 bg-gray-900 space-y-6">
          <div className="space-y-3">
            <div className="h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white text-sm">
              네이버 로그인
            </div>
            <div className="h-12 bg-yellow-400 rounded-lg flex items-center justify-center text-black text-sm">
              카카오 로그인
            </div>
            <div className="h-12 bg-white rounded-lg flex items-center justify-center text-black text-sm">
              구글 로그인
            </div>
          </div>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
