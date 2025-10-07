import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import PwFindContent from "./PwFindContent";

const meta = {
  title: "Components/Auth/Find/PwFindContent",
  component: PwFindContent,
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
} satisfies Meta<typeof PwFindContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithNavigation: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="min-h-screen bg-gray-900 p-6">
          <div className="max-w-md mx-auto">
            <div className="mb-6 text-white">
              <h2 className="text-lg">비밀번호 재설정 페이지</h2>
            </div>
            <Story />
          </div>
        </div>
      </MemoryRouter>
    ),
  ],
};
