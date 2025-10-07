import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import IdFindContent from "./IdFindContent";

const meta = {
  title: "Components/Auth/Find/IdFindContent",
  component: IdFindContent,
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
} satisfies Meta<typeof IdFindContent>;

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
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-white">
            <h2 className="text-lg">아이디 찾기 페이지</h2>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
};
