import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlanViewToggleButton } from "./PlanViewToggleButton";
import type { PlanViewType } from "./PlanViewToggleButton";

const meta = {
  title: "Components/Main/Plan/PlanViewToggleButton",
  component: PlanViewToggleButton,
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
} satisfies Meta<typeof PlanViewToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListView: Story = {
  args: {
    viewType: "list",
    toggleViewType: () => console.log("toggleViewType"),
  },
};

export const CalendarView: Story = {
  args: {
    viewType: "calendar",
    toggleViewType: () => console.log("toggleViewType"),
  },
};

export const Interactive: Story = {
  args: {
    viewType: "list",
    toggleViewType: () => console.log("toggleViewType"),
  },
  render: function InteractiveToggle(args) {
    const [viewType, setViewType] = React.useState<PlanViewType>(args.viewType);

    const handleToggle = () => {
      const newViewType = viewType === "list" ? "calendar" : "list";
      setViewType(newViewType);
      args.toggleViewType();
    };

    return (
      <PlanViewToggleButton viewType={viewType} toggleViewType={handleToggle} />
    );
  },
};

export const WithCustomBackground: Story = {
  args: {
    viewType: "list",
    toggleViewType: () => console.log("toggleViewType"),
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-100 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
