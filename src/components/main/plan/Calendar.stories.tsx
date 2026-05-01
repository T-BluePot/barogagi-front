import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Calendar from "./Calendar";

const meta = {
  title: "Components/Main/Plan/Calendar",
  component: Calendar,
  parameters: {
    layout: "fullscreen",
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
    disablePastDates: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    withTitle: false,
    selectedDate: new Date(),
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {
      "2026-03-25": true,
      "2026-03-28": true,
    },
    disablePastDates: false,
  },
};

export const WithTitle: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(),
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {
      "2026-03-25": true,
      "2026-03-28": true,
    },
    disablePastDates: false,
  },
};

export const NoSelectedDate: Story = {
  args: {
    withTitle: false,
    selectedDate: null,
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {
      "2026-03-25": true,
      "2026-03-28": true,
    },
    disablePastDates: false,
  },
};

export const NoMarkedDates: Story = {
  args: {
    withTitle: false,
    selectedDate: new Date(),
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {},
    disablePastDates: false,
  },
};

export const ManyMarkedDates: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(),
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {
      "2026-03-21": true,
      "2026-03-23": true,
      "2026-03-25": true,
      "2026-03-27": true,
      "2026-03-28": true,
      "2026-03-30": true,
    },
    disablePastDates: false,
  },
};

export const DisablePastDates: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(),
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {
      "2026-03-25": true,
      "2026-03-28": true,
    },
    disablePastDates: true,
  },
};

export const Interactive: Story = {
  args: {
    withTitle: true,
    selectedDate: new Date(),
    onChangeDate: () => console.log("onChangeDate"),
    markedDates: {
      "2026-03-25": true,
      "2026-03-28": true,
    },
    disablePastDates: false,
  },
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      args.selectedDate
    );

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date);
      console.log("onChangeDate", date);
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
