import type { Meta, StoryObj } from "@storybook/react-vite";
import AddScheduleButton from "./AddScheduleButton";

const meta = {
  title: "Components/Main/Plan/Main/AddScheduleButton",
  component: AddScheduleButton,
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
  args: {
    onAddSchedule: () => console.log("onAddSchedule"),
  },
} satisfies Meta<typeof AddScheduleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onAddSchedule: () => console.log("onAddSchedule"),
  },
};

export const WithCustomBackground: Story = {
  args: {
    onAddSchedule: () => console.log("onAddSchedule"),
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-100 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const MultipleButtons: Story = {
  args: {
    onAddSchedule: () => console.log("onAddSchedule"),
  },
  render: (args) => (
    <div className="flex gap-4 items-center">
      <AddScheduleButton {...args} />
      <AddScheduleButton {...args} />
      <AddScheduleButton {...args} />
    </div>
  ),
};
