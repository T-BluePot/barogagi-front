import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import LoginButtonSection from "./LoginButtonSection";

const meta = {
  title: "Components/Auth/Landing/LoginButtonSection",
  component: LoginButtonSection,
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
} satisfies Meta<typeof LoginButtonSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InLandingPage: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-md space-y-12">
            <div className="text-center space-y-4">
              <h1 className="typo-title-01 text-white">바로가기</h1>
              <p className="typo-body text-gray-20">
                간편하게 로그인하고
                <br />
                다양한 서비스를 이용해보세요
              </p>
            </div>
            <Story />
          </div>
        </div>
      </MemoryRouter>
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
