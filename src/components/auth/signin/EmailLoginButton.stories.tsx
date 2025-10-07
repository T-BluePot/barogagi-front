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
