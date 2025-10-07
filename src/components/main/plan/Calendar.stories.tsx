import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import Calendar from "./Calendar";

const meta = {
  title: "Components/Main/Plan/Calendar",
  component: Calendar,
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
    withTitle: {
      control: "boolean",
    },
    selectedDate: {
      control: "date",
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    withTitle: false,
    selectedDate: new Date(2025, 4, 15), // 2025년 5월 15일
    onChangeDate: action("onChangeDate"),
    markedDates: {
      "2025-05-05": true,
      "2025-05-10": true,
      "2025-05-20": true,
      "2025-05-25": true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const WithTitle: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(2025, 4, 15), // 2025년 5월 15일
    onChangeDate: action("onChangeDate"),
    markedDates: {
      "2025-05-05": true,
      "2025-05-10": true,
      "2025-05-20": true,
      "2025-05-25": true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const NoSelectedDate: Story = {
  args: {
    withTitle: false,
    selectedDate: null,
    onChangeDate: action("onChangeDate"),
    markedDates: {
      "2025-05-05": true,
      "2025-05-10": true,
      "2025-05-20": true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const NoMarkedDates: Story = {
  args: {
    withTitle: false,
    selectedDate: new Date(2025, 4, 15),
    onChangeDate: action("onChangeDate"),
    markedDates: {},
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const ManyMarkedDates: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(2025, 4, 15),
    onChangeDate: action("onChangeDate"),
    markedDates: {
      "2025-05-01": true,
      "2025-05-03": true,
      "2025-05-05": true,
      "2025-05-07": true,
      "2025-05-10": true,
      "2025-05-12": true,
      "2025-05-15": true,
      "2025-05-18": true,
      "2025-05-20": true,
      "2025-05-22": true,
      "2025-05-25": true,
      "2025-05-28": true,
      "2025-05-30": true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(2025, 4, 15),
    onChangeDate: action("onChangeDate"),
    markedDates: {
      "2025-05-05": true,
      "2025-05-10": true,
      "2025-05-20": true,
      "2025-05-25": true,
    },
  },
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      args.selectedDate
    );

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date);
      action("onChangeDate")(date);
    };

    return (
      <div className="w-96 p-4">
        <Calendar
          {...args}
          selectedDate={selectedDate}
          onChangeDate={handleDateChange}
        />
      </div>
    );
  },
};
