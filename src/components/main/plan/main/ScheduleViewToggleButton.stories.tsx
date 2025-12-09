import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ScheduleViewToggleButton,
  type ScheduleViewType,
} from "./ScheduleViewToggleButton";

const meta = {
  title: "Components/Main/Plan/List/ScheduleViewToggleButton",
  component: ScheduleViewToggleButton,
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
    viewType: {
      control: { type: "radio" },
      options: ["list", "calendar"],
    },
  },
  args: {
    toggleViewType: () => console.log("toggleViewType"),
  },
} satisfies Meta<typeof ScheduleViewToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListView: Story = {
  args: {
    viewType: "list",
  },
};

export const CalendarView: Story = {
  args: {
    viewType: "calendar",
  },
};

export const Interactive: Story = {
  args: {
    viewType: "list",
  },
  render: function InteractiveToggle(args) {
    const [viewType, setViewType] = React.useState<ScheduleViewType>(
      args.viewType
    );

    const handleToggle = () => {
      const newViewType = viewType === "list" ? "calendar" : "list";
      setViewType(newViewType);
      args.toggleViewType();
    };

    return (
      <ScheduleViewToggleButton
        viewType={viewType}
        toggleViewType={handleToggle}
      />
    );
  },
};

export const WithCustomBackground: Story = {
  args: {
    viewType: "list",
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-100 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
