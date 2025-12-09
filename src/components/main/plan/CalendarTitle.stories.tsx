import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarTitle } from "./CalendarTitle";

const meta: Meta<typeof CalendarTitle> = {
  title: "Components/Main/Plan/CalendarTitle",
  component: CalendarTitle,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    selectedDate: {
      control: "date",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDate: new Date(2025, 4, 15), // 2025년 5월 15일
  },
};
